import { Context } from "./context"
import { Trait } from "./trait"
import { EventListenerSet } from "./event_listener_set"

export class EventManager {
  context: Context
  boundEventListeners: EventListenerSet
  connected: boolean

  constructor(context: Context) {
    this.context = context
    this.boundEventListeners = wrapEventListeners(this.eventListeners, this.trait)
    this.connected = false
  }

  connect() {
    if (!this.connected) {
      for (const eventName in this.boundEventListeners) {
        const eventListener = this.boundEventListeners[eventName]
        this.element.addEventListener(eventName, eventListener, false)
      }
      this.connected = true
    }
  }

  disconnect() {
    if (this.connected) {
      for (const eventName in this.boundEventListeners) {
        const eventListener = this.boundEventListeners[eventName]
        this.element.removeEventListener(eventName, eventListener, false)
      }
      this.connected = false
    }
  }

  get eventListeners(): EventListenerSet {
    return this.context.eventListeners
  }

  get trait(): Trait {
    return this.context.trait
  }

  get element(): Element {
    return this.context.element
  }
}

function wrapEventListeners(eventListeners: EventListenerSet, target: any): EventListenerSet {
  const boundEventListeners: EventListenerSet = {}
  for (const eventName in eventListeners) {
    const eventListener = eventListeners[eventName]
    boundEventListeners[eventName] = wrapEventListener(eventListener, target)
  }
  return boundEventListeners
}

function wrapEventListener(eventListener: EventListener, target: any): EventListener {
  return function(event: Event) {
    const result = eventListener.call(target, event)
    if (result === false) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
