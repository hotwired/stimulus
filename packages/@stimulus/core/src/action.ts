import { ActionDescriptor } from "./action_descriptor"
import { Context } from "./context"
import { Controller } from "./controller"
import { Scope } from "./scope"

export class Action implements EventListenerObject {
  readonly context: Context
  readonly descriptor: ActionDescriptor
  readonly eventTarget: EventTarget

  constructor(context: Context, descriptor: ActionDescriptor, eventTarget: EventTarget) {
    this.context = context
    this.descriptor = descriptor
    this.eventTarget = eventTarget
  }

  connect() {
    this.eventTarget.addEventListener(this.eventName, this, false)
  }

  disconnect() {
    this.eventTarget.removeEventListener(this.eventName, this, false)
  }

  hasSameDescriptorAs(action: Action | null): boolean {
    return action != null && action.descriptor.isEqualTo(this.descriptor)
  }

  handleEvent(event: Event) {
    if (this.willBeInvokedByEvent(event)) {
      this.invokeWithEvent(event)
    }
  }

  get eventName(): string {
    return this.descriptor.eventName
  }

  get method(): Function {
    const method = this.controller[this.methodName]
    if (typeof method == "function") {
      return method
    }
    throw new Error(`Action "${this.descriptor}" references undefined method "${this.methodName}"`)
  }

  private invokeWithEvent(event: Event) {
    try {
      this.method.call(this.controller, event)
    } catch (error) {
      this.context.reportError(error, `invoking action "${this.descriptor}"`, event, this)
    }
  }

  private willBeInvokedByEvent(event: Event): boolean {
    const eventTarget = event.target
    if (this.element === eventTarget) {
      return true
    } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
      return this.scope.containsElement(eventTarget)
    } else {
      return true
    }
  }

  private get controller(): Controller {
    return this.context.controller
  }

  private get methodName(): string {
    return this.descriptor.methodName
  }

  private get element(): Element {
    return this.scope.element
  }

  private get scope(): Scope {
    return this.context.scope
  }
}
