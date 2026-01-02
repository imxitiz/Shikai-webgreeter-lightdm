declare global {
  interface LightDMUser {
    username: string
    display_name?: string
    session?: string
    image?: string
    logged_in?: boolean
  }

  interface LightDMSession {
    name: string
    key: string
    type?: string
  }

  interface LightDMSignal {
    connect: (callback: (text?: string, type?: number) => void) => void
    disconnect: () => void
    _callback?: ((text?: string, type?: number) => void) | null
  }

  interface LightDM {
    lock_hint: boolean
    can_shutdown: boolean
    can_restart: boolean
    can_suspend: boolean
    can_hibernate: boolean
    select_user_hint?: string | null
    is_authenticated?: boolean
    users: LightDMUser[]
    sessions: LightDMSession[]
    default_session: string
    hostname: string
    authenticate: (username: string) => void
    cancel_authentication: () => void
    respond: (password: string) => void
    start_session: (session: string) => void
    shutdown: () => void
    restart: () => void
    suspend: () => void
    hibernate: () => void
    show_prompt: LightDMSignal
    authentication_complete: LightDMSignal
    show_message: LightDMSignal
  }

  interface GreeterConfig {
    branding?: {
      background_images_dir?: string
      logo_image?: string
      user_image?: string
    }
    greeter?: {
      default_user?: string | null
      default_session?: string
    }
  }

  interface GreeterComm {
    broadcast: (data: string) => void
  }

  interface ThemeUtils {
    dirlist: (dir: string, onlyImages: boolean, callback: (files: string[]) => void) => void
  }

  // Global variables
  // eslint-disable-next-line no-var
  var lightdm: LightDM
  // eslint-disable-next-line no-var
  var greeter_config: GreeterConfig
  // eslint-disable-next-line no-var
  var greeter_comm: GreeterComm | false
  // eslint-disable-next-line no-var
  var theme_utils: ThemeUtils

  interface Window {
    __is_debug: boolean
    __store: unknown
    lightdm: LightDM
    greeter_config: GreeterConfig
    greeter_comm: GreeterComm | false
  }
}

export {}
