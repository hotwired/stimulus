export class EventObserver {
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
      this.target.addEventListener(this.name, this.listener, this.useCapture)
    }
    this.references++
    return this.references == 1
  }

  stopObserving() {
    if (this.references > 0) {
      if (this.references == 1) {
        this.target.removeEventListener(this.name, this.listener, this.useCapture)
      }
      this.references--
    }
    return this.references == 0
  }
}
