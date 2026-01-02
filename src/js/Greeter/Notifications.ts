export const types = { Info: 'info', Success: 'success', Warning: 'warning', Error: 'error' }
const root = document.getElementById('notificationroot')

export function notify(msg: string, type: string) {
  if (!root) return
  const nt = document.createElement('div')
  nt.className = 'notification ' + type
  nt.innerText = msg
  root.appendChild(nt)
  setTimeout(() => {
    nt.style.opacity = '1'
    setTimeout(() => {
      nt.style.opacity = '0'
      setTimeout(() => {
        if (root.contains(nt)) {
          root.removeChild(nt)
        }
      }, 500)
    }, 2000)
  }, 100)
}
