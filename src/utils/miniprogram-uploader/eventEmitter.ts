class EventEmitter {
    constructor() {
      this.events = {}
    }
  
    on(event: string, listener: any) {
      if (typeof this.events[event] !== 'object') {
        this.events[event] = []
      }
      this.events[event].push(listener)
      return () => this.off(event, listener)
    }
  
    off(event: string, listener: any) {
      if (typeof this.events[event] === 'object') {
        const idx = this.events[event].indexOf(listener)
        if (idx > -1) {
          this.events[event].splice(idx, 1)
        }
      }
    }
  
    emit(event: string, ...args: string[]) {
      if (typeof this.events[event] === 'object') {
        this.events[event].forEach(listener => listener.apply(this, args))
      }
    }
  
    once(event: string, listener: any) {
      const remove = this.on(event, (...args: string[]) => {
        remove()
        listener.apply(this, args)
      })
    }
  }
  
  export default EventEmitter