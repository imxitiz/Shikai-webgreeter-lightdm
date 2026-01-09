import type { LightDMUser, LightDMSession } from '../State/types'

declare global {
  interface Window {
    __is_debug?: boolean
    lightdm?: any
  }
  const lightdm: any
  const greeter_config: any
  const theme_utils: any
}

export function getInitialUser(): LightDMUser {
  if (typeof lightdm === 'undefined' || !lightdm) {
    return { username: 'user', display_name: 'User', session: 'plasma', image: '' }
  }
  if (lightdm.lock_hint) {
    const user = lightdm.users.find((user: LightDMUser) => user.logged_in)
    if (user != undefined) return user
  }
  if (typeof greeter_config !== 'undefined' && greeter_config?.greeter) {
    if (greeter_config.greeter.default_user != undefined && greeter_config.greeter.default_user != null) {
      const user = lightdm.users.find((user: LightDMUser) => user.username == greeter_config.greeter.default_user)
      if (user != undefined) return user
    }
  }
  if (lightdm.select_user_hint != undefined && lightdm.select_user_hint != null) {
    const user = lightdm.users.find((user: LightDMUser) => user.username == lightdm.select_user_hint)
    if (user != undefined) return user
  }
  return lightdm.users[0]
}

export function getInitialSession(): LightDMSession {
  if (typeof lightdm === 'undefined' || !lightdm) {
    return { name: 'Plasma', key: 'plasma', type: 'x11' }
  }
  return (
    findSession(getInitialUser().session) ||
    (typeof greeter_config !== 'undefined' && findSession(greeter_config?.greeter?.default_session)) ||
    findSession(lightdm.default_session) ||
    lightdm.sessions[0]
  )
}

export function findSession(name: string | undefined | null): LightDMSession | false {
  if (name == undefined || name == null) return false
  return lightdm.sessions.find((session: LightDMSession) =>
    session.name.toLowerCase() == name.toLowerCase() || session.key.toLowerCase() === name.toLowerCase()
  )
}

export function getSessions(): LightDMSession[] {
  if (window.__is_debug === true) {
    return [
      { name: 'Plasma (Wayland)', key: 'plasmawayland', type: 'wayland' },
      { name: 'GNOME', key: 'gnome', type: 'wayland' },
      { name: 'KDE Plasma', key: 'plasma', type: 'x11' },
      { name: 'i3', key: 'i3', type: 'x11' },
      { name: 'Hyprland', key: 'hyprland', type: 'wayland' }
    ]
  }
  return lightdm.sessions || []
}

export function getHostname(): string {
  if (typeof lightdm === 'undefined' || !lightdm) {
    return 'localhost'
  }
  return lightdm.hostname
}

export function getWallpaperDir(): string {
  if (window.__is_debug === true) {
    return './assets/media/wallpapers/'
  }
  return typeof greeter_config !== 'undefined' && greeter_config?.branding?.background_images_dir
    ? greeter_config.branding.background_images_dir
    : './assets/media/wallpapers/'
}

const MAX_WALLPAPERS = 30

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getWallpapers(dir: string, callback?: (wallpapers: string[]) => void): string[] | void {
  if (window.__is_debug === true) {
    const defs: string[] = []
    for (let i = 1; i < 12; i++) {
      defs.push('Wallpaper' + (i > 9 ? i : '0' + i) + '.' + (i > 10 ? 'png' : 'jpg'))
    }
    const result = defs.map((e) => dir + e)
    if (callback) {
      callback(result)
      return
    }
    return result
  }
  theme_utils.dirlist(dir, true, (wallpapers: string[]) => {
    if (wallpapers.length > MAX_WALLPAPERS) {
      callback?.(shuffleArray(wallpapers).slice(0, MAX_WALLPAPERS))
    } else {
      callback?.(wallpapers)
    }
  })
}

export function getLogosDir(): string {
  if (window.__is_debug === true) {
    return './assets/media/logos/'
  }
  return greeter_config?.branding?.logo_image
    ? greeter_config.branding.logo_image
    : './assets/media/logos/'
}

// Centralized built-in default logos. Use this across the app instead of duplicating the list.
export const DEFAULT_LOGOS: Array<[string, string]> = [
  ['archlinux', './assets/media/logos/archlinux.png'],
  ['ubuntu', './assets/media/logos/ubuntu.png'],
  ['antergos', './assets/media/logos/antergos.png'],
  ['debian', './assets/media/logos/debian.png'],
  ['tux', './assets/media/logos/tux.png']
]

export function getLogos(dir: string, callback?: (logos: Array<[string, string]>) => void): Array<[string, string]> | undefined {
  const DEFAULT_LOGOS_DIR = './assets/media/logos/'

  if (window.__is_debug === true) {
    if (callback) {
      callback(DEFAULT_LOGOS)
      return
    }
    return DEFAULT_LOGOS
  }

  // Try the provided dir first, fall back to bundled assets if nothing is found
  theme_utils.dirlist(dir, true, (r: string[]) => {
    const result = r.map((o) => [o.split('/').pop()?.replace(/\.[^/.]+$/, '') || '', o] as [string, string])

    if ((!result || result.length === 0) && dir !== DEFAULT_LOGOS_DIR) {
      // fallback to bundled logos
      theme_utils.dirlist(DEFAULT_LOGOS_DIR, true, (fallback: string[]) => {
        const fallbackResult = fallback.map((o) => [o.split('/').pop()?.replace(/\.[^/.]+$/, '') || '', o] as [string, string])
        callback?.(fallbackResult)
      })
      return
    }

    callback?.(result)
  })
}

export function getUserImage(user: LightDMUser): string {
  if (window.__is_debug === true) {
    return './assets/media/profile.png'
  }
  return (
			user.image ||
			greeter_config.branding.user_image ||
			"./assets/media/profile.png"
		);
}
