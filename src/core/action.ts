import { ActionDescriptor, parseActionDescriptorString, stringifyEventTarget } from "./action_descriptor"
import { Token } from "../mutation-observers"
import { Schema } from "./schema"
import { camelize } from "./string_helpers"
import { hasProperty } from "./utils"

export class Action {
  readonly element: Element
  readonly index: number
  readonly eventTarget: EventTarget
  readonly eventName: string
  readonly eventOptions: AddEventListenerOptions
  readonly identifier: string
  readonly methodName: string
  readonly keyFilter: string
  readonly schema: Schema

  static forToken(token: Token, schema: Schema) {
    return new this(token.element, token.index, parseActionDescriptorString(token.content), schema)
  }

  constructor(element: Element, index: number, descriptor: Partial<ActionDescriptor>, schema: Schema) {
    this.element = element
    this.index = index
    this.eventTarget = descriptor.eventTarget || element
    this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name")
    this.eventOptions = descriptor.eventOptions || {}
    this.identifier = descriptor.identifier || error("missing identifier")
    this.methodName = descriptor.methodName || error("missing method name")
    this.keyFilter = descriptor.keyFilter || ""
    this.schema = schema
  }

  toString() {
    const eventFilter = this.keyFilter ? `.${this.keyFilter}` : ""
    const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : ""
    return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`
  }

  isFilterTarget(event: KeyboardEvent): boolean {
    if (!this.keyFilter) {
      return false
    }

    const filteres = this.keyFilter.split("+")
    const modifiers = ["meta", "ctrl", "alt", "shift"]
    const [meta, ctrl, alt, shift] = modifiers.map((modifier) => filteres.includes(modifier))

    if (event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift) {
      return true
    }

    const standardFilter = filteres.filter((key) => !modifiers.includes(key))[0]
    if (!standardFilter) {
      // missing non modifier key
      return false
    }

    if (!hasProperty(this.keyMappings, standardFilter)) {
      error(`contains unknown key filter: ${this.keyFilter}`)
    }

    return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase()
  }

  get params() {
    const params: { [key: string]: any } = {}
    const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i")

    for (const { name, value } of Array.from(this.element.attributes)) {
      const match = name.match(pattern)
      const key = match && match[1]
      if (key) {
        params[camelize(key)] = typecast(value)
      }
    }
    return params
  }

  private get eventTargetName() {
    return stringifyEventTarget(this.eventTarget)
  }

  private get keyMappings() {
    return this.schema.keyMappings
  }
}

const defaultEventNames: { [tagName: string]: (element: Element) => string } = {
  a: () => "click",
  button: () => "click",
  form: () => "submit",
  details: () => "toggle",
  input: (e) => (e.getAttribute("type") == "submit" ? "click" : "input"),
  select: () => "change",
  textarea: () => "input",
}

export function registerDefaultEventName(tagName: string, eventName: string | ((element: Element) => string)) {
  if (typeof eventName === 'string') {
    defaultEventNames[tagName] = () => eventName
  } else {
    defaultEventNames[tagName] = eventName
  }
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
