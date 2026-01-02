type IdleCallback = (action: { type: 'Start_Event' | 'Stop_Event'; key: 'inactivity' }) => void

export default class Idle {
  private dispatch: IdleCallback
  private timer: ReturnType<typeof setTimeout> | null = null
  private timeout: number = 60000

  constructor(dispatch: IdleCallback) {
    this.dispatch = dispatch
    this.start = this.start.bind(this)
    this.reset = this.reset.bind(this)
    this.idle = this.idle.bind(this)
  }

  start() {
    this.reset()
    this.ignore(this.start)
    this.listen(this.reset)
    this.dispatch({ type: 'Stop_Event', key: 'inactivity' })
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.ignore(this.start)
    this.ignore(this.reset)
    this.dispatch({ type: 'Stop_Event', key: 'inactivity' })
  }

  private listen(event: () => void) {
    window.addEventListener('load', event)
    document.addEventListener('mousemove', event)
    document.addEventListener('keydown', event)
  }

  private ignore(event: () => void) {
    window.removeEventListener('load', event)
    document.removeEventListener('mousemove', event)
    document.removeEventListener('keydown', event)
  }

  private idle() {
    this.dispatch({ type: 'Start_Event', key: 'inactivity' })
    this.ignore(this.reset)
    this.listen(this.start)
  }

  reset() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(this.idle, this.timeout)
  }

  changeTimeout(value: number | string) {
    if (/^\d+$/.test(String(value))) {
      this.timeout = +value * 1000
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }
}
