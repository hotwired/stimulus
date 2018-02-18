import { Action } from "./action"
import { Context } from "./context"
import { Controller } from "./controller"
import { Scope } from "./scope"

export class EventListener implements EventListenerObject {
  readonly context: Context
  readonly descriptor: Action

  constructor(context: Context, descriptor: Action) {
    this.context = context
    this.descriptor = descriptor
  }

  get eventTarget(): EventTarget {
    return this.descriptor.eventTarget
  }

  connect() {
    this.eventTarget.addEventListener(this.eventName, this, false)
  }

  disconnect() {
    this.eventTarget.removeEventListener(this.eventName, this, false)
  }

  hasSameDescriptorAs(action: EventListener | null): boolean {
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
      this.context.handleError(error, `invoking action "${this.descriptor}"`, { event })
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
