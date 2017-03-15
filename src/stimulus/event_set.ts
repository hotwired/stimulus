class EventObserver {
  name: string
  target: EventTarget
  listener: EventListener
  useCapture: boolean
  private references: number

  constructor(name: string, target: EventTarget, listener: EventListener, usesCapture: boolean) {
    this.name = name
    this.target = target
    this.listener = listener
    this.useCapture = usesCapture
    this.references = 0
  }

  isEqualTo(eventObserver: EventObserver | null) {
    return eventObserver &&
      eventObserver.name === this.name &&
      eventObserver.target == this.target &&
      eventObserver.listener == this.listener &&
      eventObserver.useCapture == this.useCapture
  }

  observe() {
    if (this.references == 0) {
      console.log("addEventListener", this)
      this.target.addEventListener(this.name, this.listener, this.useCapture)
    }
    this.references++
    return this.references == 1
  }

  stopObserving() {
    if (this.references > 0) {
      if (this.references == 1) {
        console.log("removeEventListener", this)
        this.target.removeEventListener(this.name, this.listener, this.useCapture)
      }
      this.references--
    }
    return this.references == 0
  }
}

export class EventSet {
  private observers: Set<EventObserver>

  constructor() {
    this.observers = new Set<EventObserver>()
  }

  add(name: string, target: EventTarget, listener: EventListener, useCapture: boolean) {
    const observer = new EventObserver(name, target, listener, useCapture)
    this.addObserver(observer)
  }

  delete(name: string, target: EventTarget, listener: EventListener, useCapture: boolean) {
    const observer = new EventObserver(name, target, listener, useCapture)
    this.deleteObserver(observer)
  }

  private addObserver(observer: EventObserver) {
    const key = this.findMatchingObserver(observer)
    if (key.observe()) {
      this.observers.add(key)
    }
  }

  private deleteObserver(observer: EventObserver) {
    const key = this.findMatchingObserver(observer)
    if (key.stopObserving()) {
      this.observers.delete(key)
    }
  }

  private findMatchingObserver(observer: EventObserver) {
    for (const key of Array.from(this.observers)) {
      if (key.isEqualTo(observer)) {
        return key
      }
    }
    return observer
  }
}
