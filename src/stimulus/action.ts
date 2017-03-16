import { Descriptor } from "./descriptor"

export class Action {
  static defaultEventNames: { [tagName: string]: (element: Element) => string } = {
    "a":        e => "click",
    "button":   e => "click",
    "form":     e => "submit",
    "input":    e => e.getAttribute("type") == "submit" ? "click" : "change",
    "select":   e => "change",
    "textarea": e => "change"
  }

  object: object
  eventTarget: EventTarget        // target on which the event listener is installed (event.currentTarget)
  delegatedTarget: EventTarget    // target on which the action is performed
  descriptor: Descriptor

  constructor(object: object, eventTarget: EventTarget, delegatedTarget: EventTarget, descriptor: Descriptor) {
    this.object = object
    this.eventTarget = eventTarget
    this.delegatedTarget = delegatedTarget
    this.descriptor = descriptor
  }

  get eventName(): string {
    return this.descriptor.eventName || this.defaultEventName
  }

  get methodName(): string {
    return this.descriptor.methodName
  }

  get preventsDefault(): boolean {
    return this.descriptor.preventsDefault
  }

  get method(): Function | undefined {
    const value = this.object[this.methodName]
    if (typeof value == "function") {
      return <Function> value
    }
  }

  get isDirect(): boolean {
    return this.eventTarget == this.delegatedTarget
  }

  get isDelegated(): boolean {
    return !this.isDirect
  }

  isEqualTo(action?: Action): boolean {
    return action != null &&
      action.object === this.object &&
      action.eventTarget == this.eventTarget &&
      action.delegatedTarget == this.delegatedTarget &&
      action.eventName == this.eventName &&
      action.methodName == this.methodName
  }

  performWithEvent(event: Event) {
    if (this.preventsDefault) {
      event.preventDefault()
    }

    if (this.method) {
      this.method.call(this.object, event, this)
    }
  }

  private get defaultEventName(): string {
    if (this.delegatedTarget instanceof Element) {
      const tagName = this.delegatedTarget.tagName.toLowerCase()
      const defaultEventName = Action.defaultEventNames[tagName]
      if (defaultEventName) {
        return defaultEventName(this.delegatedTarget)
      }
    }

    throw new Error(`Descriptor must include an event name: "${this}`)
  }
}
