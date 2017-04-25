import { Action } from "./action"
import { Application } from "./application"
import { Context, ActionOptions } from "./context"
import { TargetSet } from "./target_set"
import { DataSet } from "./data_set"

export interface ControllerConstructor {
  new(context: Context): Controller
}

export class Controller {
  context: Context

  constructor(context: Context) {
    this.context = context
  }

  get application(): Application {
    return this.context.application
  }

  get element(): Element {
    return this.context.element
  }

  get identifier(): string {
    return this.context.identifier
  }

  get targets(): TargetSet {
    return this.context.targets
  }

  get data(): DataSet {
    return this.context.data
  }

  initialize() {
    // Override in your subclass to set up initial controller state
  }

  connect() {
    // Override in your subclass to respond when the controller is connected to the DOM
  }

  disconnect() {
    // Override in your subclass to respond when the controller is disconnected from the DOM
  }

  addAction(action: Action)
  addAction(descriptorString: string, options?: ActionOptions)
  addAction(descriptorString: string, eventTarget: EventTarget)
  addAction(actionOrDescriptorString, optionsOrEventTarget?) {
    this.context.addAction(actionOrDescriptorString, optionsOrEventTarget)
  }

  removeAction(action: Action) {
    this.context.removeAction(action)
  }
}
