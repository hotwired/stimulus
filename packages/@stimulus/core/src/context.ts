import { Action } from "./action"
import { ActionSet } from "./action_set"
import { Application } from "./application"
import { Controller } from "./controller"
import { ErrorHandler } from "./error_handler"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { Module } from "./module"
import { Schema } from "./schema"
import { Scope } from "./scope"

export class Context implements ErrorHandler, InlineActionObserverDelegate {
  readonly module: Module
  readonly scope: Scope
  readonly controller: Controller
  private actions: ActionSet
  private inlineActionObserver: InlineActionObserver

  constructor(module: Module, element: Element) {
    this.module = module
    this.scope = new Scope(this.schema, this.identifier, element)
    this.actions = new ActionSet(this)
    this.inlineActionObserver = new InlineActionObserver(this, this)

    try {
      this.controller = new module.controllerConstructor(this)
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
  inlineActionConnected(action: Action) {
    this.actions.add(action)
  }

  /** @private */
  inlineActionDisconnected(action: Action) {
    this.actions.delete(action)
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleError(error, `Error ${message}`, detail)
  }
}
