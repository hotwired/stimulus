import { ActionDescriptor } from "./action_descriptor"
import { Context } from "./context"
import { Controller } from "./controller"

export type EventTargetMatcher = (eventTarget: EventTarget) => boolean

export class Action {
  context: Context
  descriptor: ActionDescriptor
  eventTarget: EventTarget
  delegatedTargetMatcher?: EventTargetMatcher

  constructor(context: Context, descriptor: ActionDescriptor, eventTarget: EventTarget, delegatedTargetMatcher?: EventTargetMatcher) {
    this.context = context
    this.descriptor = descriptor
    this.eventTarget = eventTarget
    this.delegatedTargetMatcher = delegatedTargetMatcher
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

  get isDirect(): boolean {
    return !this.isDelegated
  }

  get isDelegated(): boolean {
    return typeof this.delegatedTargetMatcher == "function"
  }

  get method(): Function {
    const method = this.controller[this.methodName]
    if (typeof method == "function") {
      return method
    }
    throw new Error(`Action references undefined method "${this.methodName}"`)
  }

  hasSameDescriptorAs(action: Action | null): boolean {
    return action != null && action.descriptor.isEqualTo(this.descriptor)
  }

  matchDelegatedTarget(eventTarget: EventTarget) {
    const matcher = this.delegatedTargetMatcher
    return matcher ? matcher(eventTarget) : false
  }

  invokeWithEventAndTarget(event: Event, eventTarget: EventTarget) {
    this.debug("Invoking action", this, event)

    try {
      this.method.call(this.controller, event, eventTarget)
    } catch (error) {
      this.error(error, "while invoking action", this, event)
    }
  }

  // Logging

  debug(...args) {
    this.context.debug(this.descriptor.loggerTag, ...args)
  }

  error(...args) {
    this.context.error(this.descriptor.loggerTag, ...args)
  }
}
