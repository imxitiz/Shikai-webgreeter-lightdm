import '../assets/index.yml'
import '../css/tailwind.css'
import '../css/style.scss'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useStore, initializeStore } from './State/store'
import type { Session } from './State/store'

import ModernLoginWindow from './Components/LoginWindow/Modern'
import ModernSettings from './Components/SettingsWindow/Modern'
import ModernBackground from './Components/Background'
import { TooltipProvider } from './Components/ui/tooltip'

import * as Operations from './Greeter/Operations'
import { types, notify } from './Greeter/ModernNotifications'
import Idle from './Greeter/Idle'
import { set_lang, data, get_lang } from '../lang'

function hideLoader(): void {
  const loadroot = document.getElementById('loadroot')
  if (loadroot) {
    loadroot.classList.add('hidden')
    setTimeout(() => {
      loadroot.style.display = 'none'
    }, 500)
  }
  const spinner = document.querySelector('.loading-spinner')
  if (spinner) {
    (spinner as HTMLElement).style.opacity = '0'
    setTimeout(() => {
      spinner.remove()
    }, 300)
  }
}

function App(): JSX.Element {
  useEffect(() => {
    hideLoader()
  }, [])

  return (
    <TooltipProvider>
      <ModernBackground>
        <ModernLoginWindow />
        <ModernSettings />
      </ModernBackground>
    </TooltipProvider>
  )
}

function launch(): void {
  if (!window.__is_debug) {
    lightdm = window.lightdm
  }

  window.addEventListener('error', (e) => {
    console.error('Uncaught error', e.error || e.message || e)
  })
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection', e.reason || e)
  })

  initializeStore()

  const store = useStore.getState()
  window.__store = useStore

  const root = createRoot(document.getElementById('root')!)
  root.render(<App />)

  let _lastSettingsJSON = JSON.stringify(store.settings || {})
  let _settingsSaveTimer: ReturnType<typeof setTimeout> | null = null
  const scheduleSave = (): void => {
    if (_settingsSaveTimer) clearTimeout(_settingsSaveTimer)
    _settingsSaveTimer = setTimeout(() => {
      try {
        const current = JSON.stringify(useStore.getState().settings || {})
        if (current !== _lastSettingsJSON) {
          _lastSettingsJSON = current
          useStore.getState().saveSettings()
        }
      } catch (err) {
        console.warn('Failed to persist settings', err)
      }
    }, 150)
  }
  useStore.subscribe(scheduleSave)

  const wallCallback = (wallpapers: string[]): void => {
    document.body.onclick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const path = e.composedPath ? e.composedPath() : []
      const isInteractive =
        target?.closest?.('button, a, input, textarea, select, label, [role="button"]') ||
        path.some((el) => {
          const elem = el as HTMLElement
          return elem?.nodeType === 1 && elem?.matches?.('button, a, input, textarea, select, label, [role="button"]')
        })

      const inNoWall =
        target?.closest?.('.no-wall-change') ||
        path.some((el) => {
          const elem = el as HTMLElement
          return elem?.nodeType === 1 && elem?.classList?.contains?.('no-wall-change')
        })

      if (!isInteractive && !inNoWall) {
        const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
        document.body.style.backgroundImage = `url('${wallpaper}')`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center center'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.classList.add('has-wallpaper')
        try {
          localStorage.setItem('CurrentWallpaper', wallpaper)
        } catch {
          /* ignore */
        }
        if (typeof greeter_comm !== 'undefined' && greeter_comm) {
          try {
            greeter_comm.broadcast(wallpaper)
          } catch (err) {
            console.warn('greeter_comm.broadcast failed', err)
          }
        }
      }
    }

    if (!document.body.style.backgroundImage) {
      const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
      document.body.style.backgroundImage = `url('${wallpaper}')`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.classList.add('has-wallpaper')
      try {
        localStorage.setItem('CurrentWallpaper', wallpaper)
      } catch {
        /* ignore */
      }
      if (typeof greeter_comm !== 'undefined' && greeter_comm) {
        try {
          greeter_comm.broadcast(wallpaper)
        } catch {
          /* ignore */
        }
      }
    }
  }

  try {
    try {
      const last = localStorage.getItem('CurrentWallpaper')
      if (last) {
        document.body.style.backgroundImage = `url('${last}')`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center center'
        document.body.style.backgroundRepeat = 'no-repeat'
      }
    } catch {
      /* ignore */
    }

    if (window.__is_debug) {
      wallCallback(Operations.getWallpapers(Operations.getWallpaperDir()) as string[])
    } else {
      Operations.getWallpapers(Operations.getWallpaperDir(), wallCallback)
    }
  } catch (err) {
    console.warn('Failed to load wallpapers', err)
    wallCallback(['./assets/media/wallpapers/Wallpaper01.jpg'])
  }

  const setTheme = (isDark: boolean): void => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }
  let lastTheme = useStore.getState().settings.behaviour.dark_mode
  setTheme(lastTheme)

  Operations.getLogos(Operations.getLogosDir(), (dt: string | [string, string][]) =>
    useStore.getState().setLogos(dt)
  )

  const idle = new Idle((action: { type: string; key?: string }) => {
    if (action.type === 'Start_Event' && action.key) {
      useStore.getState().startEvent(action.key as 'inactivity')
    } else if (action.type === 'Stop_Event' && action.key) {
      useStore.getState().stopEvent(action.key as 'inactivity')
    }
  })
  idle.changeTimeout(useStore.getState().settings.behaviour.idle.timeout)
  if (useStore.getState().settings.behaviour.idle.enabled) {
    idle.start()
  }

  let lastLang: string
  let idleTimeout: number
  let idleEnabled = useStore.getState().settings.behaviour.idle.enabled

  useStore.subscribe((state) => {
    if (idleEnabled !== state.settings.behaviour.idle.enabled) {
      idleEnabled = state.settings.behaviour.idle.enabled
      if (idleEnabled) {
        idle.start()
      } else {
        idle.stop()
      }
    }

    if (idleTimeout !== state.settings.behaviour.idle.timeout) {
      idleTimeout = state.settings.behaviour.idle.timeout
      idle.changeTimeout(idleTimeout)
    }

    if (lastLang !== state.settings.behaviour.language) {
      lastLang = state.settings.behaviour.language
      set_lang(lastLang)
    }

    if (lastTheme !== state.settings.behaviour.dark_mode) {
      lastTheme = state.settings.behaviour.dark_mode
      setTheme(lastTheme)
    }

    if (state.runtime.events.loginSuccess && !window.__is_debug) {
      const session = state.runtime.session as Session
      if (session && lightdm) {
        lightdm.start_session(session.key)
      }
    }
  })

  if (window.__is_debug === true) {
    setInterval(() => {
      const hints = data.get(get_lang(), 'demo.hints') as string[] | undefined
      if (hints && hints.length > 0) {
        const hintPrefix = (data.get(get_lang(), 'demo.hint') as string) || 'Hint:'
        notify(hintPrefix + ' ' + hints[Math.floor(Math.random() * hints.length)], types.Info)
      }
    }, 15 * 1000)

    setTimeout(() => {
      const infoMsg = data.get(get_lang(), 'demo.notifications.info') as string | undefined
      if (infoMsg) notify(infoMsg, types.Info)
      setTimeout(() => {
        const successMsg = data.get(get_lang(), 'demo.notifications.success') as string | undefined
        if (successMsg) notify(successMsg, types.Success)
        setTimeout(() => {
          const warningMsg = data.get(get_lang(), 'demo.notifications.warning') as string | undefined
          if (warningMsg) notify(warningMsg, types.Warning)
          setTimeout(() => {
            const errorMsg = data.get(get_lang(), 'demo.notifications.error') as string | undefined
            if (errorMsg) notify(errorMsg, types.Error)
          }, 500)
        }, 500)
      }, 500)
    }, 1500)
  }
}

window.onload = (): void => {
  if (!window.__is_debug) {
    if (window.lightdm === undefined) {
      window.addEventListener('GreeterReady', () => launch())
    } else {
      launch()
    }
  } else {
    launch()
  }
}

window.addEventListener('GreeterBroadcastEvent', ((e: CustomEvent) => {
  try {
    document.body.style.backgroundImage = `url('${e.data}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.classList.add('has-wallpaper')
    try {
      localStorage.setItem('CurrentWallpaper', e.data)
    } catch {
      /* ignore */
    }
  } catch (err) {
    console.warn('Failed to apply broadcast background', err)
  }
}) as EventListener)
