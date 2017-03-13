import { Action } from "./action"
import { X } from "./x"

export interface ControllerConstructor {
  new(x: X): Controller
}

export class Controller {
  x: X

  constructor(x: X) {
    this.x = x
  }

  get element() {
    return this.x.element
  }

  get identifier() {
    return this.x.identifier
  }

  get targets() {
    return this.x.targets
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
    this.x.addAction(action)
  }

  removeAction(action: Action) {
    this.x.removeAction(action)
  }
}
