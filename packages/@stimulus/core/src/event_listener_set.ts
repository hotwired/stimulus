import { Action } from "./action"
import { Context } from "./context"
import { EventListener } from "./event_listener"

export class EventListenerSet {
  readonly context: Context
  private started: boolean
  private eventListenersByAction: Map<Action, EventListener>

  constructor(context: Context) {
    this.context = context
    this.started = false
    this.eventListenersByAction = new Map
  }

  start() {
    if (!this.started) {
      this.started = true
      this.connectEventListeners()
    }
  }

  stop() {
    if (this.started) {
      this.disconnectEventListeners()
      this.started = false
    }
  }

  get eventListeners(): EventListener[] {
    return Array.from(this.eventListenersByAction.values())
  }

  addEventListenerForAction(action: Action) {
    if (!this.eventListenersByAction.has(action)) {
      const eventListener = new EventListener(this.context, action)
      this.eventListenersByAction.set(action, eventListener)
      if (this.started) eventListener.connect()
    }
  }

  deleteEventListenerForAction(action: Action) {
    const eventListener = this.eventListenersByAction.get(action)
    if (eventListener) {
      this.eventListenersByAction.delete(action)
      eventListener.disconnect()
    }
  }

  private connectEventListeners() {
    this.eventListeners.forEach(eventListener => eventListener.connect())
  }

  private disconnectEventListeners() {
    this.eventListeners.forEach(eventListener => eventListener.disconnect())
  }
}
