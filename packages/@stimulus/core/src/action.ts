import { ActionDescriptor, parseActionDescriptorString, stringifyEventTarget } from "./action_descriptor"
import { Token } from "@stimulus/mutation-observers"

export class Action {
  readonly element: Element
  readonly index: number
  readonly eventTarget: EventTarget
  readonly eventName: string
  readonly eventOptions: AddEventListenerOptions
  readonly identifier: string
  readonly methodName: string

  static forToken(token: Token) {
    return new this(token.element, token.index, parseActionDescriptorString(token.content))
  }

  constructor(element: Element, index: number, descriptor: Partial<ActionDescriptor>) {
    this.element      = element
    this.index        = index
    this.eventTarget  = descriptor.eventTarget || element
    this.eventName    = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name")
    this.eventOptions = descriptor.eventOptions || {}
    this.identifier   = descriptor.identifier || error("missing identifier")
    this.methodName   = descriptor.methodName || error("missing method name")
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
  "input":    e => e.getAttribute("type") == "submit" ? "click" : "input",
  "select":   e => "change",
  "textarea": e => "input"
}

export function getDefaultEventNameForElement(element: Element): string | undefined {
  const tagName = element.tagName.toLowerCase()
  if (tagName in defaultEventNames) {
    return defaultEventNames[tagName](element)
  }
}

function error(message: string): never {
  throw new Error(message)
}
