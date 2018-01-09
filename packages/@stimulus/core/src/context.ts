import { Action } from "./action"
import { ActionDescriptor } from "./action_descriptor"
import { ActionSet } from "./action_set"
import { Application } from "./application"
import { Configuration } from "./configuration"
import { ContextSet } from "./context_set"
import { Controller } from "./controller"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { Scope } from "./scope"

export class Context implements InlineActionObserverDelegate {
  readonly contextSet: ContextSet
  readonly scope: Scope
  readonly controller: Controller
  private actions: ActionSet
  private inlineActionObserver: InlineActionObserver

  constructor(contextSet: ContextSet, element: Element) {
    this.contextSet = contextSet
    this.scope = new Scope(this.configuration, this.identifier, element)
    this.actions = new ActionSet(this)
    this.inlineActionObserver = new InlineActionObserver(this, this)

    try {
      this.controller = new contextSet.controllerConstructor(this)
      this.controller.initialize()
    } catch (error) {
      this.handleError(error, "initializing controller")
    }
  }

  connect() {
    this.actions.start()
    this.inlineActionObserver.start()

    try {
      this.controller.connect()
    } catch (error) {
      this.handleError(error, "connecting controller")
    }
  }

  disconnect() {
    try {
      this.controller.disconnect()
    } catch (error) {
      this.handleError(error, "disconnecting controller")
    }

    this.inlineActionObserver.stop()
    this.actions.stop()
  }

  get application(): Application {
    return this.contextSet.application
  }

  get identifier(): string {
    return this.contextSet.identifier
  }

  get configuration(): Configuration {
    return this.application.configuration
  }

  get element(): Element {
    return this.scope.element
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  // Actions

  addAction(action: Action)
  addAction(descriptorString: string, eventTarget: EventTarget)
  addAction(actionOrDescriptorString, eventTarget?) {
    let action

    if (actionOrDescriptorString instanceof Action) {
      action = actionOrDescriptorString

    } else if (typeof actionOrDescriptorString == "string") {
      const descriptorString = actionOrDescriptorString
      if (!isEventTarget(eventTarget)) {
        eventTarget = this.element
      }
      const descriptor = ActionDescriptor.forElementWithInlineDescriptorString(eventTarget, descriptorString)
      action = new Action(this, descriptor, eventTarget)
    }

    if (action) {
      this.actions.add(action)
    }
  }

  removeAction(action: Action) {
    this.actions.delete(action)
  }

  // Inline action observer delegate

  /** @private */
  inlineActionConnected(action: Action) {
    this.addAction(action)
  }

  /** @private */
  inlineActionDisconnected(action: Action) {
    this.removeAction(action)
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleError(error, `Error ${message}`, detail)
  }
}

function isEventTarget(object: any): boolean {
  if (!object) {
    return false
  } else if (typeof EventTarget != "undefined") {
    return object instanceof EventTarget
  } else {
    return typeof object.addEventListener == "function"
  }
}
