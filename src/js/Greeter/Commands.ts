import { types as classicTypes, notify as classicNotify } from './Notifications'
import { types as modernTypes, notify as modernNotify } from './ModernNotifications'
import { get_lang, data } from '../../lang'

declare global {
  interface Window {
    __is_debug?: boolean
    lightdm?: any
  }
  // If a global 'lightdm' var is present it should be available on window
}

function getNotifySystem() {
  const modernRoot = document.getElementById('notificationroot')
  if (modernRoot) {
    return { types: modernTypes, notify: modernNotify }
  }
  return { types: classicTypes, notify: classicNotify }
}

function execute(bool: boolean, message: string, callback: () => void) {
  const { types, notify } = getNotifySystem()
  if (bool) {
    notify(message, types.Info)
    const run = () => {
      try {
        if (typeof callback === 'function') {
          callback()
        } else {
          console.warn('Command callback is not a function')
        }
      } catch (e) {
        console.error('Command execution failed', e)
      }
    }

    if (window.__is_debug !== true) {
      setTimeout(run, 1000)
    } else {
      // In debug mode call immediately so devs can see the output right away
      run()
    }
  } else {
    notify(data.get(get_lang(), 'commands.messages.unavailable'), types.Warning)
  }
}

export function sleep() {
  return execute(lightdm?.can_suspend, data.get(get_lang(), 'commands.messages.sleep'), () => {
    if (typeof lightdm?.suspend === 'function') lightdm.suspend()
  })
}
export function restart() {
  return execute(lightdm?.can_restart, data.get(get_lang(), 'commands.messages.reboot'), () => {
    if (typeof lightdm?.restart === 'function') lightdm.restart()
  })
}
export function shutdown() {
  return execute(lightdm?.can_shutdown, data.get(get_lang(), 'commands.messages.shutdown'), () => {
    if (typeof lightdm?.shutdown === 'function') lightdm.shutdown()
  })
}
export function hibernate() {
  return execute(lightdm?.can_hibernate, data.get(get_lang(), 'commands.messages.hibernate'), () => {
    if (typeof lightdm?.hibernate === 'function') lightdm.hibernate()
  })
}
