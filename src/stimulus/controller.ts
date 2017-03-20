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

  addAction(descriptorString: string, actionTarget: EventTarget = this.element) {
    const descriptor = Descriptor.forDescriptorString(descriptorString)
    let matcher

    if (actionTarget != window) {
      const {targetName} = descriptor
      if (targetName) {
        const selector = `[data-${this.identifier}-target~='${targetName}']`
        matcher = (eventTarget) => eventTarget.matches(selector) && this.context.canControlElement(eventTarget)
      } else {
        matcher = (eventTarget) => eventTarget == actionTarget
      }
    }

    const action = new Action(this, descriptor, actionTarget, matcher)
    this.context.addAction(action)
    return action
  }

  removeAction(action: Action) {
    this.context.removeAction(action)
  }
}
