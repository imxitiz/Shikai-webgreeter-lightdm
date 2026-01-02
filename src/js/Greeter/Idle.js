export default class Idle {
    constructor(callbacks) {
        this.callbacks = callbacks
        this.start = this.start.bind(this)
        this.reset = this.reset.bind(this)
        this.idle = this.idle.bind(this)
    }

    start() {
        this.reset()
        this.ignore(this.start)
        this.listen(this.reset)
        this.callbacks.stopInactivity?.()
    }

    stop() {
        clearTimeout(this.timer)
        this.ignore(this.start)
        this.ignore(this.reset)
        this.callbacks.stopInactivity?.()
    }

    listen(event) {
        window.addEventListener("load", event)
        document.addEventListener("mousemove", event)
        document.addEventListener("keydown", event)
    }

    ignore(event) {
        window.removeEventListener("load", event)
        document.removeEventListener("mousemove", event)
        document.removeEventListener("keydown", event)
    }

    idle() {
        this.callbacks.startInactivity?.()
        this.ignore(this.reset)
        this.listen(this.start)
    }
    
    reset() {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.idle, this.timeout)
    }

    changeTimeout(value) {
        if (/^\d+$/.test(value)) {
            this.timeout = (+value) * 1000
            clearTimeout(this.timer)
        }
    }
}