import '../assets/index.yml'
import '../css/tailwind.css'
import '../css/style.scss'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import useStore from './State/store'
import ModernLoginWindow from './Components/LoginWindow/Modern'
import ModernSettings from './Components/SettingsWindow/Modern'
import ModernBackground from './Components/Background'
import { TooltipProvider } from './Components/ui/tooltip'

import * as Operations from './Greeter/Operations'
import revealElement from './BackgroundAnimator'
import { types, notify } from './Greeter/ModernNotifications'
import Idle from './Greeter/Idle'
import { set_lang, data, get_lang } from '@/lang'

interface LightDM {
  users?: Array<{ username: string; display_name: string; session: string; image: string; logged_in?: boolean }>
  sessions?: Array<{ name: string; key: string; type: string }>
  hostname?: string
  default_session?: string
  can_shutdown?: boolean
  can_restart?: boolean
  can_suspend?: boolean
  can_hibernate?: boolean
  lock_hint?: boolean
  select_user_hint?: string
  is_authenticated?: boolean
  authenticate?: (username: string) => void
  cancel_authentication?: () => void
  respond?: (password: string) => void
  start_session?: (session: string) => void
  shutdown?: () => void
  restart?: () => void
  suspend?: () => void
  hibernate?: () => void
  show_prompt?: {
    connect?: (callback: () => void) => void
    disconnect?: () => void
  }
}

interface GreeterComm {
  broadcast?: (data: string) => void
}

declare global {
  interface Window {
    __is_debug?: boolean
    __store?: ReturnType<typeof useStore>
    // `lightdm` and `greeter_comm` are provided by the host environment; don't redeclare them here.
  }
  // const lightdm: LightDM
  const greeter_comm: GreeterComm
}

function hideLoader() {
  const loadroot = document.getElementById('loadroot')
  if (loadroot) {
    loadroot.classList.add('hidden')
    setTimeout(() => {
      loadroot.style.display = 'none'
    }, 500)
  }
  const spinner = document.querySelector('.loading-spinner')
  if (spinner) {
    ;(spinner as HTMLElement).style.opacity = '0'
    setTimeout(() => {
      spinner.remove()
    }, 300)
  }
}

function ModernApp() {
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

function launch() {
  if (!window.__is_debug && window.lightdm) {
    ;(window as Window & { lightdm: LightDM }).lightdm = window.lightdm
  }

  window.addEventListener('error', (e) => {
    console.error('Uncaught error', e.error || e.message || e)
  })
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection', e.reason || e)
  })

  window.__store = useStore
  useStore.getState().updateSettings()

  const rootElement = document.getElementById('root')
  if (!rootElement) {
    console.error('Root element not found')
    return
  }
  const root = createRoot(rootElement)
  root.render(<ModernApp />)

  let _lastSettingsJSON = JSON.stringify(useStore.getState().settings || {})
  let _settingsSaveTimer: ReturnType<typeof setTimeout> | null = null
  const scheduleSave = () => {
    if (_settingsSaveTimer) {
      clearTimeout(_settingsSaveTimer)
    }
    _settingsSaveTimer = setTimeout(() => {
      try {
        const current = JSON.stringify(useStore.getState().settings || {})
        if (current !== _lastSettingsJSON) {
          _lastSettingsJSON = current
          useStore.getState().saveSettings()
        }
      } catch {
        console.warn('Failed to persist settings')
      }
    }, 150)
  }

  useStore.subscribe(() => {
    scheduleSave()
  })


  const wallCallback = (wallpapers: string[]) => {
    document.body.onclick = (e: MouseEvent) => {
      type ExtendedEvent = MouseEvent & { composedPath?: () => EventTarget[]; path?: EventTarget[] };
      const extendedEvent = e as ExtendedEvent
      const path = extendedEvent.composedPath ? extendedEvent.composedPath() : (extendedEvent.path || [])
      const isInteractive =
        (e.target as HTMLElement)?.closest?.('button, a, input, textarea, select, label, [role="button"]') ||
        path?.some((el) => (el as Element)?.nodeType === 1 && (el as Element)?.matches?.('button, a, input, textarea, select, label, [role="button"]'))

      try {
        if (document.body.classList.contains('settings-open')) return
      } catch {}

      const inNoWall =
        (e.target as HTMLElement)?.closest?.('.no-wall-change') ||
        path?.some((el) => (el as Element)?.nodeType === 1 && (el as Element)?.classList?.contains?.('no-wall-change'))

      if (!isInteractive && !inNoWall) {
        const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
        const clickX = (e as MouseEvent).clientX
        const clickY = (e as MouseEvent).clientY
        // use CSS-heavy animator; fallback to an immediate set if animation/clip-path unsupported
        try {
          revealElement(document.body, `url('${wallpaper}')`, { x: clickX, y: clickY }).catch(() => {
            document.body.style.backgroundImage = `url('${wallpaper}')`
            document.body.classList.add('has-wallpaper')
          })
        } catch {
        document.body.style.backgroundImage = `url('${wallpaper}')`
        document.body.classList.add('has-wallpaper')
        }

        try {
          localStorage.setItem('CurrentWallpaper', wallpaper)
        } catch {
          /* ignore */
        }
        if (greeter_comm?.broadcast) {
          try {
            greeter_comm.broadcast(wallpaper)
          } catch {
            console.warn('greeter_comm.broadcast failed')
          }
        }
      }
    }

    if (!document.body.style.backgroundImage) {
      const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
      document.body.style.backgroundImage = `url('${wallpaper}')`
      document.body.style.backgroundSize = 'cover'
      // document.body.style.backgroundPosition = 'center center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.classList.add('has-wallpaper')
      try {
        localStorage.setItem('CurrentWallpaper', wallpaper)
      } catch {
        /* ignore */
      }
      if (greeter_comm?.broadcast) {
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
        // document.body.style.backgroundPosition = 'center center'
        document.body.style.backgroundRepeat = 'no-repeat'
      }
    } catch {
      /* ignore */
    }

    if (window.__is_debug) {
      const wallpapers = Operations.getWallpapers(Operations.getWallpaperDir()) as string[]
      wallCallback(wallpapers)
    } else {
      Operations.getWallpapers(Operations.getWallpaperDir(), wallCallback)
    }
  } catch {
    console.warn('Failed to load wallpapers')
    wallCallback(['./assets/media/wallpapers/Wallpaper01.jpg'])
  }

  const setTheme = (isDark: boolean) => {
    if (isDark) {
					document.documentElement.classList.add("dark");
					document.documentElement.setAttribute("data-theme", "dark");
				} else {
					document.documentElement.classList.remove("dark");
					document.documentElement.setAttribute("data-theme", "light");
				}
  }
  let lastTheme = useStore.getState().settings.behaviour.dark_mode
  setTheme(lastTheme)

  Operations.getLogos(Operations.getLogosDir(), (dt) => {
    useStore.getState().setLogos(dt)
  })

  const idle = new Idle((action) => {
    if (action.type === 'Start_Event') {
      useStore.getState().startEvent(action.key)
    } else {
      useStore.getState().stopEvent(action.key)
    }
  })
  idle.changeTimeout(useStore.getState().settings.behaviour.idle.timeout)
  if (useStore.getState().settings.behaviour.idle.enabled) {
    idle.start()
  }

  let lastLang: string | undefined
  let idleTimeout: number | undefined
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
      const session = state.runtime.session
      if (session && typeof lightdm !== 'undefined' && lightdm?.start_session) {
        lightdm.start_session(session.key)
      }
    }
  })

  if (window.__is_debug === true) {
    setInterval(() => {
      const hints = data.get(get_lang(), 'demo.hints')
      if (hints && Array.isArray(hints) && hints.length > 0) {
        const hintPrefix = data.get(get_lang(), 'demo.hint') || 'Hint:'
        notify(`${hintPrefix} ${hints[Math.floor(Math.random() * hints.length)]}`, types.Info)
      }
    }, 15 * 1000)

    setTimeout(() => {
      const infoMsg = data.get(get_lang(), 'demo.notifications.info')
      if (infoMsg) notify(infoMsg, types.Info)
      setTimeout(() => {
        const successMsg = data.get(get_lang(), 'demo.notifications.success')
        if (successMsg) notify(successMsg, types.Success)
        setTimeout(() => {
          const warningMsg = data.get(get_lang(), 'demo.notifications.warning')
          if (warningMsg) notify(warningMsg, types.Warning)
          setTimeout(() => {
            const errorMsg = data.get(get_lang(), 'demo.notifications.error')
            if (errorMsg) notify(errorMsg, types.Error)
          }, 500)
        }, 500)
      }, 500)
    }, 1500)
  }
}

window.onload = () => {
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

window.addEventListener("GreeterBroadcastEvent", (evt: Event) => {
	try {
		const evtAny = evt as unknown as { data?: unknown; detail?: unknown };
		const maybeUrl =
			typeof evtAny.data !== "undefined" ? evtAny.data : evtAny.detail;
		if (typeof maybeUrl !== "string") return;
		const url = maybeUrl;
revealElement(document.body, `url('${url}')`).catch(() => {
			try {
		document.body.style.backgroundImage = `url('${url}')`;
				document.body.classList.add("has-wallpaper");
				try { 
          localStorage.setItem("CurrentWallpaper", url as string) 
        } catch {}
		} catch (e) {
				console.warn('Failed to apply broadcast background fallback', e)
		}
})
	} catch (err) {
		console.warn("Failed to apply broadcast background", err);
	}
});
