import { ActionDescriptor } from "./action_descriptor"
import { Context } from "./context"
import { Controller } from "./controller"

export class Action implements EventListenerObject {
  context: Context
  descriptor: ActionDescriptor
  eventTarget: EventTarget

  constructor(context: Context, descriptor: ActionDescriptor, eventTarget: EventTarget) {
    this.context = context
    this.descriptor = descriptor
    this.eventTarget = eventTarget
  }

  get controller(): Controller {
    return this.context.controller
  }

  get eventName(): string {
    return this.descriptor.eventName
  }

  get methodName(): string {
    return this.descriptor.methodName
  }

  get method(): Function {
    const method = this.controller[this.methodName]
    if (typeof method == "function") {
      return method
    }
    throw new Error(`Action "${this.descriptor}" references undefined method "${this.methodName}"`)
  }

  hasSameDescriptorAs(action: Action | null): boolean {
    return action != null && action.descriptor.isEqualTo(this.descriptor)
  }

  addEventListener() {
    this.eventTarget.addEventListener(this.eventName, this, false)
  }

  removeEventListener() {
    this.eventTarget.removeEventListener(this.eventName, this, false)
  }

  handleEvent(event: Event) {
    try {
      this.method.call(this.controller, event, event.currentTarget)
    } catch (error) {
      this.context.reportError(error, `invoking action "${this.descriptor}"`, event, this)
    }
  }
}
