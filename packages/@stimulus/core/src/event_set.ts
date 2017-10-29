import { EventObserver } from "./event_observer"

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
