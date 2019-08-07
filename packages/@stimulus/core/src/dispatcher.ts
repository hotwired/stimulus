import { Application } from "./application"
import { Binding } from "./binding"
import { BindingObserverDelegate } from "./binding_observer"
import { EventListener } from "./event_listener"

export class Dispatcher implements BindingObserverDelegate {
  readonly application: Application
  private eventListenerMaps: Map<EventTarget, Map<string, EventListener>>
  private started: boolean

  constructor(application: Application) {
    this.application = application
    this.eventListenerMaps = new Map
    this.started = false
  }

  start() {
    if (!this.started) {
      this.started = true
      this.eventListeners.forEach(eventListener => eventListener.connect())
    }
  }

  stop() {
    if (this.started) {
      this.started = false
      this.eventListeners.forEach(eventListener => eventListener.disconnect())
    }
  }

  get eventListeners(): EventListener[] {
    return Array.from(this.eventListenerMaps.values())
      .reduce((listeners, map) => listeners.concat(Array.from(map.values())), [] as EventListener[])
  }

  // Binding observer delegate

  /** @hidden */
  bindingConnected(binding: Binding) {
    this.fetchEventListenerForBinding(binding).bindingConnected(binding)
  }

  /** @hidden */
  bindingDisconnected(binding: Binding) {
    this.fetchEventListenerForBinding(binding).bindingDisconnected(binding)
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    this.application.handleError(error, `Error ${message}`, detail)
  }

  private fetchEventListenerForBinding(binding: Binding): EventListener {
    const { eventTarget, eventName, eventOptions } = binding
    return this.fetchEventListener(eventTarget, eventName, eventOptions)
  }

  private fetchEventListener(eventTarget: EventTarget, eventName: string, eventOptions: AddEventListenerOptions): EventListener {
    const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget)
    const cacheKey = this.cacheKey(eventName, eventOptions)
    let eventListener = eventListenerMap.get(cacheKey)
    if (!eventListener) {
      eventListener = this.createEventListener(eventTarget, eventName, eventOptions)
      eventListenerMap.set(cacheKey, eventListener)
    }
    return eventListener
  }

  private createEventListener(eventTarget: EventTarget, eventName: string, eventOptions: AddEventListenerOptions): EventListener {
    const eventListener = new EventListener(eventTarget, eventName, eventOptions)
    if (this.started) {
      eventListener.connect()
    }
    return eventListener
  }

  private fetchEventListenerMapForEventTarget(eventTarget: EventTarget): Map<string, EventListener> {
    let eventListenerMap = this.eventListenerMaps.get(eventTarget)
    if (!eventListenerMap) {
      eventListenerMap = new Map
      this.eventListenerMaps.set(eventTarget, eventListenerMap)
    }
    return eventListenerMap
  }

  private cacheKey(eventName: string, eventOptions: any): string {
    const parts = [ eventName ]
    Object.keys(eventOptions).sort().forEach(key => {
      parts.push(`${eventOptions[key] ? "" : "!"}${key}`)
    })
    return parts.join(":")
  }
}
