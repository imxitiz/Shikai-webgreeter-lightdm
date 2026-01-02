import type { SettingsState, Theme } from '../State/types'

function saveItem(key: string, data: unknown): unknown {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.warn('localStorage.setItem failed for key', key, err)
  }
  return data
}

function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item != null && item != undefined && item !== 'null' && item !== 'undefined' && item !== '') {
      return JSON.parse(item) as T
    }
  } catch (err) {
    console.warn('localStorage.getItem failed for key', key, err)
  }
  return null
}

export function saveSettings(data: SettingsState): SettingsState {
  return saveItem('Settings', data) as SettingsState
}

export function getSettings(): SettingsState | null {
  return getItem<SettingsState>('Settings')
}

export function saveThemes(data: Theme[]): Theme[] {
  return saveItem('Themes', data) as Theme[]
}

export function getThemes(): Theme[] | null {
  return getItem<Theme[]>('Themes')
}
