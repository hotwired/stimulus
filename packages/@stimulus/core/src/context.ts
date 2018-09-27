import { Application } from "./application"
import { BindingObserver } from "./binding_observer"
import { Controller } from "./controller"
import { DataMapObserver } from "./data_map_observer"
import { Dispatcher } from "./dispatcher"
import { ErrorHandler } from "./error_handler"
import { Module } from "./module"
import { Schema } from "./schema"
import { Scope } from "./scope"

export class Context implements ErrorHandler {
  readonly module: Module
  readonly scope: Scope
  readonly controller: Controller
  private bindingObserver: BindingObserver
  private dataMapObserver: DataMapObserver

  constructor(module: Module, scope: Scope) {
    this.module = module
    this.scope = scope
    this.controller = new module.controllerConstructor(this)
    this.bindingObserver = new BindingObserver(this, this.dispatcher)
    this.dataMapObserver = new DataMapObserver(this, this.controller)

    try {
      this.controller.initialize()
    } catch (error) {
      this.handleError(error, "initializing controller")
    }
  }

  connect() {
    this.bindingObserver.start()
    this.dataMapObserver.start()

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

    this.dataMapObserver.stop()
    this.bindingObserver.stop()
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

  get dispatcher(): Dispatcher {
    return this.application.dispatcher
  }

  get element(): Element {
    return this.scope.element
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleError(error, `Error ${message}`, detail)
  }
}
