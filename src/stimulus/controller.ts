import { Action } from "./action"
import { Context } from "./context"
import { Descriptor } from "./descriptor"
import { TargetSet } from "./target_set"

export interface ControllerConstructor {
  new(context: Context): Controller
}

export class Controller {
  context: Context

  constructor(context: Context) {
    this.context = context
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

  initialize() {
    // Override in your subclass to set up initial controller state
  }

  connect() {
    // Override in your subclass to respond when the controller is connected to the DOM
  }

  disconnect() {
    // Override in your subclass to respond when the controller is disconnected from the DOM
  }

  addAction(descriptorString: string, target: EventTarget | string = this.element) {
    let eventTarget, matcher

    if (typeof target == "string") {
      const targetName = target
      eventTarget = this.element
      matcher = (eventTarget) => this.targets.matchesElementWithTargetName(eventTarget, targetName)
    } else {
      eventTarget = target
    }

    const descriptor = Descriptor.forElementWithInlineDescriptorString(eventTarget, descriptorString)
    const action = new Action(this, descriptor, eventTarget, matcher)
    this.context.addAction(action)
  }

  removeAction(action: Action) {
    this.context.removeAction(action)
  }
}
