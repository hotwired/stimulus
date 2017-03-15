import { Action } from "./action"
import { Context } from "./context"

export interface ControllerConstructor {
  new(context: Context): Controller
}

export class Controller {
  context: Context

  constructor(context: Context) {
    this.context = context
  }

  get element() {
    return this.context.element
  }

  get identifier() {
    return this.context.identifier
  }

  get targets() {
    return this.context.targets
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

  addAction(action: Action) {
    this.context.addAction(action)
  }

  removeAction(action: Action) {
    this.context.removeAction(action)
  }
}
