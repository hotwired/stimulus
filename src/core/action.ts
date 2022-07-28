import { ActionDescriptor, parseActionDescriptorString, stringifyEventTarget } from "./action_descriptor"
import { Token } from "../mutation-observers"
import { camelize } from "./string_helpers"
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

  get params() {
    const params:{ [key: string]: any } = {}
    const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`)

    for (const { name, value } of Array.from(this.element.attributes)) {
      const match = name.match(pattern)
      const key = match && match[1]
      if (key) {
        params[camelize(key)]= typecast(value)
      }
    }
    return params
  }

  private get eventTargetName() {
    return stringifyEventTarget(this.eventTarget)
  }
}

const defaultEventNames: { [tagName: string]: (element: Element) => string } = {
  "a":        e => "click",
  "button":   e => "click",
  "form":     e => "submit",
  "details":  e => "toggle",
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

function typecast(value: any): any {
  try {
    return JSON.parse(value)
  } catch (o_O) {
    return value
  }
}
