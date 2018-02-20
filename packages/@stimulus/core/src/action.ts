import { ActionDescriptor, parseDescriptorString, stringifyEventTarget } from "./action_descriptor"

export class Action {
  readonly element: Element
  readonly eventTarget: EventTarget
  readonly eventName: string
  readonly identifier: string
  readonly methodName: string

  static forElementWithDescriptorString(element: Element, descriptorString: string) {
    return new this(element, parseDescriptorString(descriptorString))
  }

  constructor(element: Element, descriptor: Partial<ActionDescriptor>) {
    this.element     = element
    this.eventTarget = descriptor.eventTarget || element
    this.eventName   = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name")
    this.identifier  = descriptor.identifier || error("missing identifier")
    this.methodName  = descriptor.methodName || error("missing method name")
  }

  toString() {
    const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : ""
    return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`
  }

  private get eventTargetName() {
    return stringifyEventTarget(this.eventTarget)
  }
}

const defaultEventNames: { [tagName: string]: (element: Element) => string } = {
  "a":        e => "click",
  "button":   e => "click",
  "form":     e => "submit",
  "input":    e => e.getAttribute("type") == "submit" ? "click" : "change",
  "select":   e => "change",
  "textarea": e => "change"
}

export function getDefaultEventNameForElement(element): string | undefined {
  const tagName = element.tagName.toLowerCase()
  if (tagName in defaultEventNames) {
    return defaultEventNames[tagName](element)
  }
}

function error(message): never {
  throw new Error(message)
}
