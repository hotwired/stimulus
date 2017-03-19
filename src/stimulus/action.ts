import { Descriptor } from "./descriptor"

export type EventTargetMatcher = (eventTarget: EventTarget) => boolean

export class Action {
  object: Object
  descriptor: Descriptor
  eventTarget: EventTarget
  delegatedTargetMatcher: EventTargetMatcher | null

  constructor(object: Object, descriptor: Descriptor, eventTarget: EventTarget, delegatedTargetMatcher: EventTargetMatcher) {
    this.object = object
    this.descriptor = descriptor
    this.eventTarget = eventTarget
    this.delegatedTargetMatcher = delegatedTargetMatcher
  }

  get eventName(): string {
    return this.descriptor.eventName
  }

  get methodName(): string {
    return this.descriptor.methodName
  }

  get preventsDefault(): boolean {
    return this.descriptor.preventsDefault
  }

  get isDirect(): boolean {
    return this.delegatedTargetMatcher == null
  }

  get isDelegated(): boolean {
    return !this.isDirect
  }

  get method(): Function {
    const method = this.object[this.methodName]
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

  performWithEvent(event: Event) {
    if (this.preventsDefault) {
      event.preventDefault()
    }

    this.method.call(this.object, event)
  }
}
