import { Application } from "./application"
import { BindingObserver } from "./binding_observer"
import { Controller } from "./controller"
import { Dispatcher } from "./dispatcher"
import { ErrorHandler } from "./error_handler"
import { Module } from "./module"
import { Schema } from "./schema"
import { Scope } from "./scope"
import { TargetGuide } from "./target_guide"
import { ValueObserver } from "./value_observer"
import { TargetObserver, TargetObserverDelegate } from "./target_observer"

export class Context implements ErrorHandler, TargetObserverDelegate {
  readonly module: Module
  readonly scope: Scope
  readonly controller: Controller
  readonly targetGuide: TargetGuide
  private bindingObserver: BindingObserver
  private valueObserver: ValueObserver
  private targetObserver: TargetObserver

  constructor(module: Module, scope: Scope) {
    this.module = module
    this.scope = scope
    this.controller = new module.controllerConstructor(this)
    this.targetGuide = new TargetGuide(this.scope, this.controller)
    this.bindingObserver = new BindingObserver(this, this.dispatcher)
    this.valueObserver = new ValueObserver(this, this.controller)
    this.targetObserver = new TargetObserver(this, this)

    try {
      this.controller.initialize()
      this.logDebugActivity("initialize")
    } catch (error) {
      this.handleError(error, "initializing controller")
    }
  }

  connect() {
    this.bindingObserver.start()
    this.valueObserver.start()
    this.targetObserver.start()

    try {
      this.controller.connect()
      this.logDebugActivity("connect")
    } catch (error) {
      this.handleError(error, "connecting controller")
    }
  }

  disconnect() {
    try {
      this.controller.disconnect()
      this.logDebugActivity("disconnect")
    } catch (error) {
      this.handleError(error, "disconnecting controller")
    }

    this.targetObserver.stop()
    this.valueObserver.stop()
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

  dispatch(eventName: string, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
    const type = prefix ? `${prefix}:${eventName}` : eventName
    const event = new CustomEvent(type, { detail, bubbles, cancelable })
    target.dispatchEvent(event)
    return event
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleError(error, `Error ${message}`, detail)
  }

  // Logging

  handleWarning(warning: string, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleWarning(warning, `Warning ${message}`, detail)
  }

  logDebugActivity = (functionName: string, detail: object = {}): void => {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.logDebugActivity(this.identifier, functionName, detail)
  }

  // Target observer delegate

  targetConnected(element: Element, name: string) {
    this.invokeControllerMethod(`${name}TargetConnected`, element)
  }

  targetDisconnected(element: Element, name: string) {
    this.invokeControllerMethod(`${name}TargetDisconnected`, element)
  }

  // Private

  invokeControllerMethod(methodName: string, ...args: any[]) {
    const controller: any = this.controller
    if (typeof controller[methodName] == "function") {
      controller[methodName](...args)
    }
  }
}
