import { Action } from "./action"
import { ActionEvent } from "./action_event"
import { Context } from "./context"
import { Controller } from "./controller"
import { Scope } from "./scope"
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

  get eventOptions(): AddEventListenerOptions {
    return this.action.eventOptions
  }

  get identifier(): string {
    return this.context.identifier
  }

  handleEvent(event: Event) {
    const actionEvent = this.prepareActionEvent(event)
    if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
      this.invokeWithEvent(actionEvent)
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

  private applyEventModifiers(event: Event): boolean {
    const { element } = this.action
    const { actionDescriptorFilters } = this.context.application
    const { controller } = this.context

    let passes = true

    for (const [name, value] of Object.entries(this.eventOptions)) {
      if (name in actionDescriptorFilters) {
        const filter = actionDescriptorFilters[name]

        passes = passes && filter({ name, value, event, element, controller })
      } else {
        continue
      }
    }

    return passes
  }

  private prepareActionEvent(event: Event): ActionEvent {
    return Object.assign(event, { params: this.action.params })
  }

  private invokeWithEvent(event: ActionEvent) {
    const { target, currentTarget } = event
    try {
      this.method.call(this.controller, event)
      this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName })
    } catch (error: any) {
      const { identifier, controller, element, index } = this
      const detail = { identifier, controller, element, index, event }
      this.context.handleError(error, `invoking action "${this.action}"`, detail)
    }
  }

  private willBeInvokedByEvent(event: Event): boolean {
    const eventTarget = event.target

    if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
      return false
    }

    if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
      return false
    }

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
