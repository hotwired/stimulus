import { Action } from "./action"
import { ActionEvent } from "./action_event"
import { Context } from "./context"
import { Controller } from "./controller"
import { Scope } from "./scope"
import { EventModifiers } from "./event_modifiers"

export class Binding {
  readonly context: Context
  readonly action: Action

  constructor(context: Context, action: Action) {
    this.context = context
    this.action = action
  }

  get index(): number {
    return this.action.index
  }

  get eventTarget(): EventTarget {
    return this.action.eventTarget
  }

  get eventOptions(): EventModifiers {
    return this.action.eventOptions
  }

  get identifier(): string {
    return this.context.identifier
  }

  handleEvent(event: Event) {
    if (this.willBeInvokedByEvent(event) && this.shouldBeInvokedPerSelf(event)) {
      this.processStopPropagation(event);
      this.processPreventDefault(event);

      this.invokeWithEvent(event)
    }
  }

  get eventName(): string {
    return this.action.eventName
  }

  get method(): Function {
    const method = (this.controller as any)[this.methodName]
    if (typeof method == "function") {
      return method
    }
    throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`)
  }

  private processStopPropagation(event: Event) {
    if (this.eventOptions.stop) {
      event.stopPropagation();
    }
  }

  private processPreventDefault(event: Event) {
    if (this.eventOptions.prevent) {
      event.preventDefault();
    }
  }

  private invokeWithEvent(event: Event) {
    const { target, currentTarget } = event
    try {
      const { params } = this.action
      const actionEvent: ActionEvent = Object.assign(event, { params })
      this.method.call(this.controller, actionEvent)
      this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName })
    } catch (error) {
      const { identifier, controller, element, index } = this
      const detail = { identifier, controller, element, index, event }
      this.context.handleError(error, `invoking action "${this.action}"`, detail)
    }
  }

  private shouldBeInvokedPerSelf(event: Event): boolean {
    if (this.action.eventOptions.self === true) {
      return this.action.element === event.target
    } else if (this.action.eventOptions.self === false) {
      return this.action.element !== event.target
    } else {
      return true
    }
  }

  private willBeInvokedByEvent(event: Event): boolean {
    const eventTarget = event.target
    if (this.element === eventTarget) {
      return true
    } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
      return this.scope.containsElement(eventTarget)
    } else {
      return this.scope.containsElement(this.action.element)
    }
  }

  private get controller(): Controller {
    return this.context.controller
  }

  private get methodName(): string {
    return this.action.methodName
  }

  private get element(): Element {
    return this.scope.element
  }

  private get scope(): Scope {
    return this.context.scope
  }
}
