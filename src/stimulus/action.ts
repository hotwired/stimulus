import { Descriptor } from "./descriptor"

export class Action {
  static defaultEventNames = {
    "a":        (e: Element) => "click",
    "button":   (e: Element) => "click",
    "form":     (e: Element) => "submit",
    "input":    (e: Element) => e.getAttribute("type") == "submit" ? "click" : "change",
    "select":   (e: Element) => "change",
    "textarea": (e: Element) => "change"
  }

  object: object
  currentTarget: EventTarget  // target on which the event listener is installed (event.currentTarget)
  eventTarget: EventTarget    // target on which the action is performed
  descriptor: Descriptor

  constructor(object: object, currentTarget: EventTarget, eventTarget: EventTarget, descriptor: Descriptor) {
    this.object = object
    this.currentTarget = currentTarget
    this.eventTarget = eventTarget
    this.descriptor = descriptor
  }

  get eventName(): string {
    return this.descriptor.eventName || this.defaultEventName
  }

  get methodName(): string {
    return this.descriptor.methodName
  }

  get allowsDefault(): boolean {
    return this.descriptor.allowsDefault
  }

  get method(): Function | undefined {
    const value = this.object[this.methodName]
    if (typeof value == "function") {
      return <Function> value
    }
  }

  get isDirect(): boolean {
    return this.currentTarget == this.eventTarget
  }

  get isDelegated(): boolean {
    return !this.isDirect
  }

  isEqualTo(action?: Action): boolean {
    return action != null &&
      action.object === this.object &&
      action.eventTarget == this.eventTarget &&
      action.eventName == this.eventName &&
      action.methodName == this.methodName
  }

  performWithEvent(event: Event) {
    if (this.method) {
      this.method.call(this.object, event, this)
    }
  }

  private get defaultEventName(): string {
    if (this.eventTarget instanceof Element) {
      const tagName = this.eventTarget.tagName.toLowerCase()
      const defaultEventName = Action.defaultEventNames[tagName]
      if (defaultEventName) {
        return defaultEventName(this.eventTarget)
      }
    }

    throw new Error(`Descriptor must include an event name: "${this}`)
  }
}
