import { ActionDescriptor, parseActionDescriptorString, stringifyEventTarget } from "./action_descriptor"
import { Token } from "../mutation-observers"
import { Schema } from "./schema"
import { camelize } from "./string_helpers"
import { hasProperty } from "./utils"

const allModifiers = ["meta", "ctrl", "alt", "shift"]

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

  shouldIgnoreKeyboardEvent(event: KeyboardEvent): boolean {
    if (!this.keyFilter) {
      return false
    }

    const filters = this.keyFilter.split("+")
    if (this.keyFilterDissatisfied(event, filters)) {
      return true
    }

    const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0]
    if (!standardFilter) {
      // missing non modifier key
      return false
    }

    if (!hasProperty(this.keyMappings, standardFilter)) {
      error(`contains unknown key filter: ${this.keyFilter}`)
    }

    return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase()
  }

  shouldIgnoreMouseEvent(event: MouseEvent): boolean {
    if (!this.keyFilter) {
      return false
    }

    const filters = [this.keyFilter]
    if (this.keyFilterDissatisfied(event, filters)) {
      return true
    }

    return false
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

  private keyFilterDissatisfied(event: KeyboardEvent | MouseEvent, filters: Array<string>): boolean {
    const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier))

    return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift
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
