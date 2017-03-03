import { Action } from "./action"
import { ActionObserver, ActionObserverDelegate } from "./action_observer"
import { TargetSet } from "./target_set"

export interface ControllerConstructor {
  new(identifier: string, element: Element): Controller
}

export class Controller implements ActionObserverDelegate {
  identifier: string
  element: Element
  targets: TargetSet

  private actionObserver: ActionObserver
  private eventListeners: Map<Action, EventListener>

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.element = element
    this.targets = new TargetSet(identifier, element)

    this.actionObserver = new ActionObserver(identifier, element, this)
    this.eventListeners = new Map<Action, EventListener>()

    this.initialize()
  }

  initialize() {
  }

  connect() {
    this.actionObserver.start()
  }

  disconnect() {
    this.actionObserver.stop()
  }

  // Action observer delegate

  actionConnected(action: Action) {
    const {element, eventName, methodName} = action
    const method = this[methodName]
    if (typeof method == "function") {
      const eventListener = this.fetchEventListenerForAction(action, method)
      element.addEventListener(eventName, eventListener, false)
    }
  }

  actionDisconnected(action: Action) {
    const {element, eventName} = action
    const handler = this.getEventListenerForAction(action)
    if (handler) {
      element.removeEventListener(eventName, handler, false)
    }
  }

  getEventListenerForAction(action: Action): EventListener | undefined {
    return this.eventListeners.get(action)
  }

  fetchEventListenerForAction(action: Action, method: Function): EventListener {
    let eventListener = this.eventListeners.get(action)
    if (!eventListener) {
      eventListener = <EventListener> method.bind(this)
      this.eventListeners.set(action, eventListener)
    }

    return eventListener
  }
}
