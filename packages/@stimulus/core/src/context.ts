import { Action } from "./action"
import { ActionObserver, ActionObserverDelegate } from "./action_observer"
import { Application } from "./application"
import { Controller } from "./controller"
import { ErrorHandler } from "./error_handler"
import { EventListenerSet } from "./event_listener_set"
import { Module } from "./module"
import { Schema } from "./schema"
import { Scope } from "./scope"

export class Context implements ErrorHandler, ActionObserverDelegate {
  readonly module: Module
  readonly scope: Scope
  readonly controller: Controller
  private actionObserver: ActionObserver
  private eventListeners: EventListenerSet

  constructor(module: Module, scope: Scope) {
    this.module = module
    this.scope = scope
    this.actionObserver = new ActionObserver(this.element, this.schema, this)
    this.eventListeners = new EventListenerSet(this)

    try {
      this.controller = new module.controllerConstructor(this)
      this.controller.initialize()
    } catch (error) {
      this.handleError(error, "initializing controller")
    }
  }

  connect() {
    this.actionObserver.start()
    this.eventListeners.start()

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

    this.eventListeners.stop()
    this.actionObserver.stop()
  }

  get application(): Application {
    return this.module.application
  }

  get identifier(): string {
    return this.module.identifier
  }

  get schema(): Schema {
    return this.application.schema
  }

  get element(): Element {
    return this.scope.element
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  // Inline action observer delegate

  /** @private */
  actionConnected(action: Action) {
    this.eventListeners.addEventListenerForAction(action)
  }

  /** @private */
  actionDisconnected(action: Action) {
    this.eventListeners.deleteEventListenerForAction(action)
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleError(error, `Error ${message}`, detail)
  }
}
