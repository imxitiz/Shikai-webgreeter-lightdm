import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as Operations from '../Greeter/Operations'

// Type definitions
export interface User {
  username: string
  display_name?: string
  session?: string
  image?: string
  logged_in?: boolean
}

export interface Session {
  name: string
  key: string
  type?: string
}

export interface ClockSettings {
  enabled: boolean
  format: string
}

export interface DateSettings {
  enabled: boolean
  format: string
}

export interface IdleSettings {
  enabled: boolean
  timeout: number
}

export interface CommandSettings {
  shutdown: boolean
  hibernate: boolean
  reboot: boolean
  sleep: boolean
}

export interface BehaviourSettings {
  user: boolean
  logo: boolean
  avatar: boolean
  evoker: boolean | 'show' | 'hover' | 'hide'
  session: boolean
  hostname: boolean
  draggable: boolean
  language: string
  dark_mode: boolean
  clock: ClockSettings
  date: DateSettings
  idle: IdleSettings
  commands: CommandSettings
}

export interface IconSettings {
  background: string
  foreground: string
}

export interface MainStyle {
  textcolor: string
  icons: IconSettings
}

export interface SidebarStyle {
  background: string
  logo: string
}

export interface BackgroundStyle {
  top: string
  bottom: string
}

export interface AvatarStyle {
  color: string
}

export interface SessionStyle {
  color: string
  background: string
  radius: string
}

export interface BorderStyle {
  top: string
  left: string
  radius: string
}

export interface CaretStyle {
  left: string
  right: string
}

export interface PasswordStyle {
  border: BorderStyle
  color: string
  background: string
  caret: CaretStyle
}

export interface UserbarStyle {
  background: BackgroundStyle
  avatar: AvatarStyle
  session: SessionStyle
  password: PasswordStyle
}

export interface StyleSettings {
  main: MainStyle
  sidebar: SidebarStyle
  userbar: UserbarStyle
}

export interface Settings {
  behaviour: BehaviourSettings
  style: StyleSettings
}

export interface Theme {
  name: string
  settings: Settings
}

export interface RuntimeEvents {
  loginSuccess: boolean
  loginFailure: boolean
  inactivity: boolean
}

export interface RuntimeState {
  user: User | null
  session: Session | null
  hostname: string
  logos: string | [string, string][]
  events: RuntimeEvents
}

export interface StoreState {
  runtime: RuntimeState
  settings: Settings
  themes: Theme[]
  
  // Runtime actions
  switchUser: (user?: User) => void
  switchSession: (session?: Session) => void
  startEvent: (key: keyof RuntimeEvents) => void
  stopEvent: (key: keyof RuntimeEvents) => void
  setLogos: (logos: string | [string, string][]) => void
  
  // Settings actions
  setSetting: (key: string, value: unknown) => void
  toggleSetting: (key: string) => void
  saveSettings: () => void
  loadSettings: () => void
  
  // Themes actions
  activateTheme: (index: number) => void
  addTheme: (name: string) => void
  removeTheme: (index: number) => void
  saveThemes: () => void
  loadThemes: () => void
}

// Helper functions
function getUsers(): User[] {
  if (typeof lightdm === 'undefined' || !lightdm) {
    return [{ username: 'user', display_name: 'User', session: 'plasma', image: '' }]
  }
  return lightdm.users || []
}

function getSessions(): Session[] {
  if (typeof lightdm === 'undefined' || !lightdm) {
    return [{ name: 'Plasma', key: 'plasma', type: 'x11' }]
  }
  return lightdm.sessions || []
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(deepClone) as T
  const cloned: Record<string, unknown> = {}
  for (const k of Object.keys(obj)) {
    cloned[k] = deepClone((obj as Record<string, unknown>)[k])
  }
  return cloned as T
}

function updateNested<T extends object>(object: T, key: string, value: unknown): T {
  const keys = key.split('.')
  const copy = deepClone(object)
  let iter: Record<string, unknown> = copy as Record<string, unknown>

  // Guard against prototype pollution
  const dangerousKeys = ['__proto__', 'constructor', 'prototype']

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    
    // Prevent prototype pollution attacks
    if (dangerousKeys.includes(k)) {
      console.warn('Attempted prototype pollution via key:', k)
      return object
    }

    if (i === keys.length - 1) {
      iter[k] = value
    } else {
      if (!(k in iter) || iter[k] === null || typeof iter[k] !== 'object') {
        iter[k] = {}
      }
      iter = iter[k] as Record<string, unknown>
    }
  }

  return copy
}

function queryNested(object: unknown, key: string): unknown {
  if (object == null) return undefined
  const path = key.split('.')
  let current = object as Record<string, unknown>
  for (let i = 0; i < path.length; i++) {
    if (current == null) return undefined
    current = current[path[i]] as Record<string, unknown>
  }
  return current
}

function saveToStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.warn('localStorage.setItem failed for key', key, err)
  }
}

function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item != null && item !== 'null' && item !== 'undefined' && item !== '') {
      return JSON.parse(item) as T
    }
  } catch (err) {
    console.warn('localStorage.getItem failed for key', key, err)
  }
  return null
}

// Default state
const defaultSettings: Settings = {
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
    settings: deepClone(defaultSettings)
  },
  {
    name: 'Sunset',
    settings: {
      ...deepClone(defaultSettings),
      style: {
        main: {
          textcolor: 'rgba(255,255,255,0.8)',
          icons: {
            background: 'rgba(255,0,0,0.4)',
            foreground: 'rgba(246,243,248,1)'
          }
        },
        sidebar: {
          background: 'rgba(0,0,0,0.75)',
          logo: 'assets/media/logos/archlinux.png'
        },
        userbar: {
          background: {
            top: 'rgba(0,58,255,0.75)',
            bottom: 'rgba(255,0,0,0.75)'
          },
          avatar: {
            color: 'rgba(0,0,0,1)'
          },
          session: {
            color: 'rgba(255,0,0,1)',
            background: 'rgba(0,0,0,0.75)',
            radius: '18px'
          },
          password: {
            border: {
              top: '5px solid rgba(0, 0, 0, 0.3)',
              left: '5px solid rgba(0, 0, 0, 0.3)',
              radius: '18px'
            },
            color: 'rgba(255,0,0,1)',
            background: 'rgba(0,0,0,0.4)',
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
    name: 'Glass',
    settings: {
      ...deepClone(defaultSettings),
      style: {
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
  }
]

// Create the store
export const useStore = create<StoreState>()((set, get) => ({
  runtime: {
    user: null,
    session: null,
    hostname: 'localhost',
    logos: '',
    events: {
      loginSuccess: false,
      loginFailure: false,
      inactivity: false
    }
  },
  settings: defaultSettings,
  themes: defaultThemes,

  // Runtime actions
  switchUser: (user?: User) => set((state) => {
    if (user) {
      return { runtime: { ...state.runtime, user } }
    }
    const users = getUsers()
    const userIndex = users.findIndex(u => u.username === state.runtime.user?.username)
    if (userIndex === users.length - 1 || userIndex === -1) {
      return { runtime: { ...state.runtime, user: users[0] } }
    }
    return { runtime: { ...state.runtime, user: users[userIndex + 1] } }
  }),

  switchSession: (session?: Session) => set((state) => {
    if (session) {
      return { runtime: { ...state.runtime, session } }
    }
    const sessions = getSessions()
    const sessionIndex = sessions.findIndex(s => s.key === state.runtime.session?.key)
    if (sessionIndex === sessions.length - 1 || sessionIndex === -1) {
      return { runtime: { ...state.runtime, session: sessions[0] } }
    }
    return { runtime: { ...state.runtime, session: sessions[sessionIndex + 1] } }
  }),

  startEvent: (key: keyof RuntimeEvents) => set((state) => ({
    runtime: {
      ...state.runtime,
      events: { ...state.runtime.events, [key]: true }
    }
  })),

  stopEvent: (key: keyof RuntimeEvents) => set((state) => ({
    runtime: {
      ...state.runtime,
      events: { ...state.runtime.events, [key]: false }
    }
  })),

  setLogos: (logos) => set((state) => ({
    runtime: { ...state.runtime, logos }
  })),

  // Settings actions
  setSetting: (key: string, value: unknown) => set((state) => ({
    settings: updateNested(state.settings, key, value)
  })),

  toggleSetting: (key: string) => set((state) => ({
    settings: updateNested(state.settings, key, !queryNested(state.settings, key))
  })),

  saveSettings: () => {
    const { settings } = get()
    saveToStorage('Settings', settings)
  },

  loadSettings: () => {
    const saved = loadFromStorage<Settings>('Settings')
    if (saved) {
      set({ settings: saved })
    }
  },

  // Themes actions
  activateTheme: (index: number) => set((state) => {
    if (state.themes[index]) {
      return { settings: deepClone(state.themes[index].settings) }
    }
    return {}
  }),

  addTheme: (name: string) => set((state) => ({
    themes: [...state.themes, { name, settings: deepClone(state.settings) }]
  })),

  removeTheme: (index: number) => set((state) => {
    const themes = [...state.themes]
    if (themes.length > index) {
      themes.splice(index, 1)
    }
    return { themes }
  }),

  saveThemes: () => {
    const { themes } = get()
    saveToStorage('Themes', themes)
  },

  loadThemes: () => {
    const saved = loadFromStorage<Theme[]>('Themes')
    if (saved) {
      set({ themes: saved })
    }
  }
}))

// Initialize store with runtime values
export function initializeStore(): void {
  const user = Operations.getInitialUser() as User
  const session = Operations.getInitialSession() as Session
  const hostname = Operations.getHostname()
  
  useStore.setState((state) => ({
    runtime: {
      ...state.runtime,
      user,
      session,
      hostname
    }
  }))
  
  // Load persisted settings and themes
  useStore.getState().loadSettings()
  useStore.getState().loadThemes()
}

// Export for convenience
export default useStore
