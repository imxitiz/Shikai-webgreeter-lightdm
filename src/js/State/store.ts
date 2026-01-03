import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { AppState, RuntimeEvents, SettingsState, Theme, LightDMUser, LightDMSession } from './types'
import * as Operations from '../Greeter/Operations'
import { saveSettings, getSettings, saveThemes, getThemes } from '../Greeter/Storage'
import { update, query } from '../Tools/Dictionary'
import Copy from '../Tools/Copy'

function getInitialUser(): LightDMUser | null {
  try {
    return Operations.getInitialUser()
  } catch {
    return { username: 'user', display_name: 'User', session: 'plasma', image: '' }
  }
}

function getInitialSession(): LightDMSession | null {
  try {
    return Operations.getInitialSession()
  } catch {
    return { name: 'Plasma', key: 'plasma', type: 'x11' }
  }
}

const defaultSettings: SettingsState = {
  behaviour: {
    user: true,
    logo: true,
    avatar: true,
    evoker: true,
    session: true,
    hostname: true,
    draggable: true,
    language: 'english',
    dark_mode: true,
    clock: {
      enabled: true,
      format: '%H:%K:%S'
    },
    date: {
      enabled: true,
      format: '%B %D, %Y'
    },
    idle: {
      enabled: true,
      timeout: 60
    },
    commands: {
      shutdown: true,
      hibernate: true,
      reboot: true,
      sleep: true
    }
  },
  style: {
    main: {
      textcolor: 'rgba(255,255,255,1)',
      icons: {
        background: 'rgba(0,255,255,0.4)',
        foreground: 'rgba(246,243,248,1)'
      }
    },
    sidebar: {
      background: 'rgba(0,0,0,0.75)',
      logo: 'assets/media/logos/archlinux.png'
    },
    userbar: {
      background: {
        top: 'rgba(101,0,255,0.75)',
        bottom: 'rgba(0,255,223,0.75)'
      },
      avatar: {
        color: 'rgba(0,0,0,1)'
      },
      session: {
        color: 'rgba(0,255,245,1)',
        background: 'rgba(0,0,0,0.75)',
        radius: '18px'
      },
      password: {
        border: {
          top: '5px solid rgba(0, 0, 0, 0.3)',
          left: '5px solid rgba(0, 0, 0, 0.3)',
          radius: '18px'
        },
        color: 'rgba(0,255,245,1)',
        background: 'rgba(0,0,0,0.4)',
        caret: {
          left: '<',
          right: '>'
        }
      }
    }
  }
}

const defaultThemes: Theme[] = [
  {
    name: 'Neon',
    settings: Copy(defaultSettings)
  },
  {
    name: 'Sunset',
    settings: {
      ...Copy(defaultSettings),
      style: {
        ...Copy(defaultSettings.style),
        main: {
          textcolor: 'rgba(255,255,255,0.8)',
          icons: {
            background: 'rgba(255,0,0,0.4)',
            foreground: 'rgba(246,243,248,1)'
          }
        },
        userbar: {
          ...Copy(defaultSettings.style.userbar),
          background: {
            top: 'rgba(0,58,255,0.75)',
            bottom: 'rgba(255,0,0,0.75)'
          },
          session: {
            color: 'rgba(255,0,0,1)',
            background: 'rgba(0,0,0,0.75)',
            radius: '18px'
          },
          password: {
            ...Copy(defaultSettings.style.userbar.password),
            color: 'rgba(255,0,0,1)'
          }
        }
      }
    }
  },
  {
    name: 'Glass',
    settings: {
      ...Copy(defaultSettings),
      style: {
        ...Copy(defaultSettings.style),
        main: {
          textcolor: 'rgba(255,255,255,0.8)',
          icons: {
            background: 'rgba(255,255,255,0.4)',
            foreground: 'rgba(255,255,255,1)'
          }
        },
        sidebar: {
          background: 'rgba(137,137,137,0.4)',
          logo: 'assets/media/logos/archlinux.png'
        },
        userbar: {
          ...Copy(defaultSettings.style.userbar),
          background: {
            top: 'rgba(137,137,137,0.4)',
            bottom: 'rgba(137,137,137,0.4)'
          },
          avatar: {
            color: 'rgba(255,255,255,1)'
          },
          session: {
            color: 'rgba(255,255,255,1)',
            background: 'rgba(255,255,255,0.49)',
            radius: '18px'
          },
          password: {
            border: {
              top: 'none',
              left: 'none',
              radius: '18px'
            },
            color: 'rgba(255,255,255,1)',
            background: 'rgba(255,255,255,0.4)',
            caret: {
              left: '<',
              right: '>'
            }
          }
        }
      }
    }
  },
  {
    name: 'Drowning',
    settings: {
      ...Copy(defaultSettings),
      style: {
        ...Copy(defaultSettings.style),
        main: {
          textcolor: 'rgba(255,255,255,0.7)',
          icons: {
            background: 'rgba(0,255,255,0.4)',
            foreground: 'rgba(0,0,0,1)'
          }
        },
        userbar: {
          ...Copy(defaultSettings.style.userbar),
          background: {
            top: 'rgba(0,0,0,1)',
            bottom: 'rgba(0,255,219,0.75)'
          },
          avatar: {
            color: 'rgba(255,255,255,0.7)'
          },
          password: {
            ...Copy(defaultSettings.style.userbar.password),
            border: {
              top: '5px solid rgba(0, 0, 0, 0.5)',
              left: '2px solid rgba(0, 0, 0, 0.5)',
              radius: '18px'
            },
            background: 'rgba(0,237,255,0.4)'
          }
        }
      }
    }
  },
  {
    name: 'BlueDeath',
    settings: {
      ...Copy(defaultSettings),
      style: {
        ...Copy(defaultSettings.style),
        main: {
          textcolor: 'rgba(174,239,255,0.9)',
          icons: {
            background: 'rgba(0,98,149,0.55)',
            foreground: 'rgba(174,239,255,0.9)'
          }
        },
        sidebar: {
          background: 'rgba(0,0,0,0.8)',
          logo: 'assets/media/logos/archlinux.png'
        },
        userbar: {
          ...Copy(defaultSettings.style.userbar),
          background: {
            top: 'rgba(0,26,124,1)',
            bottom: 'rgba(0,236,255,0.83)'
          },
          avatar: {
            color: 'rgba(0,10,162,0.5)'
          },
          session: {
            color: 'rgba(255,255,255,1)',
            background: 'rgba(109,0,255,0.3)',
            radius: '18px'
          },
          password: {
            ...Copy(defaultSettings.style.userbar.password),
            border: {
              top: '5px solid rgba(0, 0, 0, 0.5)',
              left: '5px solid rgba(0, 0, 0, 0.5)',
              radius: '18px'
            },
            color: 'rgba(81,0,248,1)',
            background: 'rgba(145,0,255,0.2)'
          }
        }
      }
    }
  },
  {
    name: 'NotPurple',
    settings: {
      ...Copy(defaultSettings),
      style: {
        ...Copy(defaultSettings.style),
        main: {
          textcolor: 'rgba(178,253,255,0.85)',
          icons: {
            background: 'rgba(145,0,255,0.6)',
            foreground: 'rgba(255,255,255,0.75)'
          }
        },
        sidebar: {
          background: 'rgba(0,0,0,0.6)',
          logo: 'assets/media/logos/archlinux.png'
        },
        userbar: {
          ...Copy(defaultSettings.style.userbar),
          background: {
            top: 'rgba(0,0,255,0.75)',
            bottom: 'rgba(158,0,255,0.75)'
          },
          avatar: {
            color: 'rgba(0,18,110,0.8)'
          },
          session: {
            color: 'rgba(195,78,254,1)',
            background: 'rgba(0,0,0,0.75)',
            radius: '18px'
          },
          password: {
            ...Copy(defaultSettings.style.userbar.password),
            color: 'rgba(195,78,254,1)',
            background: 'rgba(0,5,159,0.2)'
          }
        }
      }
    }
  }
]

interface StoreState extends AppState {
  // Runtime actions
  switchUser: (value?: LightDMUser) => void
  switchSession: (value?: LightDMSession) => void
  startEvent: (key: keyof RuntimeEvents) => void
  stopEvent: (key: keyof RuntimeEvents) => void
  setLogos: (logos: string | Array<[string, string]>) => void

  // Settings actions
  setSetting: (key: string, value: unknown) => void
  toggleSetting: (key: string) => void
  saveSettings: () => void
  updateSettings: () => void

  // Theme actions
  activateTheme: (key: number) => void
  addTheme: (name: string) => void
  removeTheme: (key: number) => void
  saveThemes: () => void
  updateThemes: () => void
  purgeThemes: () => void
}

function createStore() {
  const initialState: AppState = {
    runtime: {
      user: getInitialUser(),
      session: getInitialSession(),
      hostname: Operations.getHostname(),
      logos: window.__is_debug ? (Operations.getLogos(Operations.getLogosDir()) ?? '') : '',
      events: {
        loginSuccess: false,
        loginFailure: false,
        inactivity: false
      }
    },
    settings: getSettings() || defaultSettings,
    themes: getThemes() || defaultThemes
  }

  return create<StoreState>()(
    subscribeWithSelector(
      devtools(
        persist(
          immer((set, get) => ({
            ...initialState,

            // Runtime actions
            switchUser: (value) => {
              if (value) {
                set((state) => {
                  state.runtime.user = value
                }, undefined, 'runtime/switchUser')
                return
              }

              const users: LightDMUser[] = typeof lightdm !== 'undefined' && lightdm?.users
                ? (lightdm.users as LightDMUser[])
                : [{ username: 'user', display_name: 'User', session: 'plasma', image: '' }]

              const currentUser = get().runtime.user
              const userIndex = users.findIndex((u: LightDMUser) => u.username === currentUser?.username)

              if (userIndex === users.length - 1 || userIndex === -1) {
                set((state) => {
                  state.runtime.user = users[0]
                }, undefined, 'runtime/switchUser')
              } else {
                set((state) => {
                  state.runtime.user = users[userIndex + 1]
                }, undefined, 'runtime/switchUser')
              }
            },

            switchSession: (value) => {
              if (value) {
                set((state) => {
                  state.runtime.session = value
                }, undefined, 'runtime/switchSession')
                return
              }

              const sessions: LightDMSession[] = typeof lightdm !== 'undefined' && lightdm?.sessions
                ? (lightdm.sessions as LightDMSession[])
                : [{ name: 'Plasma', key: 'plasma', type: 'x11' }]

              const currentSession = get().runtime.session
              const sessionIndex = sessions.findIndex((s: LightDMSession) => s.key === currentSession?.key)

              if (sessionIndex === sessions.length - 1 || sessionIndex === -1) {
                set((state) => {
                  state.runtime.session = sessions[0]
                }, undefined, 'runtime/switchSession')
              } else {
                set((state) => {
                  state.runtime.session = sessions[sessionIndex + 1]
                }, undefined, 'runtime/switchSession')
              }
            },

            startEvent: (key) => {
              set((state) => {
                state.runtime.events[key as keyof RuntimeEvents] = true
              }, undefined, `runtime/startEvent:${String(key)}`)
            },

            stopEvent: (key) => {
              set((state) => {
                state.runtime.events[key as keyof RuntimeEvents] = false
              }, undefined, `runtime/stopEvent:${String(key)}`)
            },

            setLogos: (logos) => {
              set((state) => {
                // logos can be string or array
                state.runtime.logos = logos
              }, undefined, 'runtime/setLogos')
            },

            // Settings actions
            setSetting: (key, value) => {
              set((state) => {
                state.settings = update(state.settings, key, value)
              }, undefined, `settings/set:${String(key)}`)
            },

            toggleSetting: (key) => {
              set((state) => {
                const currentValue = query(state.settings, key)
                state.settings = update(state.settings, key, !currentValue)
              }, undefined, `settings/toggle:${String(key)}`)
            },

            saveSettings: () => {
              const settings = get().settings
              saveSettings(settings)
            },

            updateSettings: () => {
              const loaded = getSettings()
              if (loaded != null) {
                set({ settings: loaded }, undefined, 'settings/updateSettings')
              }
            },

            // Theme actions
            activateTheme: (key) => {
              const themes = get().themes
              if (themes[key]) {
                set({ settings: Copy(themes[key].settings) }, undefined, `themes/activate:${key}`)
              }
            },

            addTheme: (name) => {
              set((state) => {
                const newTheme: Theme = {
                  name,
                  settings: Copy(state.settings)
                }
                state.themes = [...state.themes, newTheme]
              }, undefined, `themes/add:${name}`)
            },

            removeTheme: (key) => {
              set((state) => {
                const themes = [...state.themes]
                if (themes.length > key) {
                  themes.splice(key, 1)
                }
                state.themes = themes
              }, undefined, `themes/remove:${key}`)
            },

            saveThemes: () => {
              const themes = get().themes
              saveThemes(themes)
            },

            updateThemes: () => {
              const loaded = getThemes()
              if (loaded != null) {
                set({ themes: loaded }, undefined, 'themes/updateThemes')
              }
            },

            purgeThemes: () => {
              set({ themes: [] }, undefined, 'themes/purge')
            }
          })),
          {
            name: 'shikai-store',
            storage: createJSONStorage(() => ({
              getItem: (key: string) => {
                try {
                  const item = localStorage.getItem(key)
                  if (item && item !== 'null' && item !== 'undefined' && item !== '') {
                    return JSON.parse(item)
                  }
                } catch (err) {
                  console.warn('Failed to get item from storage', key, err)
                }
                return null
              },
              setItem: (key: string, value: string) => {
                try {
                  localStorage.setItem(key, value)
                } catch (err) {
                  console.warn('Failed to set item in storage', key, err)
                }
              },
              removeItem: (key: string) => {
                try {
                  localStorage.removeItem(key)
                } catch (err) {
                  console.warn('Failed to remove item from storage', key, err)
                }
              }
            })),
            partialize: (state) => ({
              settings: state.settings,
              themes: state.themes
            })
          }
        ),
        { name: 'shikai-store', enabled: process.env.NODE_ENV !== 'production' }
      )
    )
  )
}

const useStore = createStore()
export default useStore
