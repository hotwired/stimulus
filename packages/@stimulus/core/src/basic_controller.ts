import { Constructor } from "./class"
import { Context } from "./context"
import { Mixin, Mix } from "./mixin"

export class BasicController {
  static uses<B extends Constructor, T extends B, C extends typeof BasicController>(this: C, mixin: Mixin<B, T>): Mix<C, T> {
    return mixin.extends(this as any)
  }

  readonly context: Context

  constructor(context: Context) {
    this.context = context
  }

  get application() {
    return this.context.application
  }

  get data() {
    return this.scope.data
  }

  get element() {
    return this.context.element
  }

  get identifier() {
    return this.scope.identifier
  }

  get scope() {
    return this.context.scope
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
}
