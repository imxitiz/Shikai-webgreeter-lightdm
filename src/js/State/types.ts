export interface LightDMUser {
  username: string
  display_name: string
  session: string
  image: string
  logged_in?: boolean
}

export interface LightDMSession {
  name: string
  key: string
  type: string
}

export interface RuntimeEvents {
  loginSuccess: boolean
  loginFailure: boolean
  inactivity: boolean
}

export interface RuntimeState {
  user: LightDMUser | null
  session: LightDMSession | null
  hostname: string
  logos: string | Array<[string, string]>
  events: RuntimeEvents
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

export interface CommandsSettings {
  shutdown: boolean
  hibernate: boolean
  reboot: boolean
  sleep: boolean
}

export interface BehaviourSettings {
	user: boolean
	logo: boolean
	avatar: boolean
	evoker: boolean
	session: boolean
	hostname: boolean
	draggable: boolean
	language: string
	dark_mode: boolean
	clock: ClockSettings
	date: DateSettings
	idle: IdleSettings
	commands: CommandsSettings
	// When true, a random theme from the default themes is applied on each load
	random_theme_on_load?: boolean
	}

export interface IconSettings {
  background: string
  foreground: string
}

export interface MainStyleSettings {
  textcolor: string
  icons: IconSettings
}

export interface SidebarStyleSettings {
  background: string
  logo: string
}

export interface UserbarBackgroundSettings {
  top: string
  bottom: string
}

export interface AvatarStyleSettings {
  color: string
}

export interface SessionStyleSettings {
  color: string
  background: string
  radius: string
}

export interface PasswordBorderSettings {
  top: string
  left: string
  radius: string
}

export interface PasswordCaretSettings {
  left: string
  right: string
}

export interface PasswordStyleSettings {
  border: PasswordBorderSettings
  color: string
  background: string
  caret: PasswordCaretSettings
}

export interface UserbarStyleSettings {
  background: UserbarBackgroundSettings
  avatar: AvatarStyleSettings
  session: SessionStyleSettings
  password: PasswordStyleSettings
}

export interface StyleSettings {
  main: MainStyleSettings
  sidebar: SidebarStyleSettings
  userbar: UserbarStyleSettings
}

export interface SettingsState {
  behaviour: BehaviourSettings
  style: StyleSettings
}

export interface Theme {
  name: string
  settings: SettingsState
}

export interface AppState {
  runtime: RuntimeState
  settings: SettingsState
  themes: Theme[]
}
