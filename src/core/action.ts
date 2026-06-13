import { ActionDescriptor, parseActionDescriptorString } from "./action_descriptor"
import { Token } from "../mutation-observers"
import { Context } from "./context"
import { camelize } from "./string_helpers"
import { hasProperty } from "./utils"

const allModifiers = ["meta", "ctrl", "alt", "shift"]

export class Action {
  readonly element: Element
  readonly index: number
  private readonly eventTargetName: string | undefined
  readonly eventName: string
  readonly eventOptions: AddEventListenerOptions
  readonly identifier: string
  readonly methodName: string
  readonly keyFilter: string
  readonly context: Context

  static forToken(token: Token, context: Context) {
    return new this(token.element, token.index, parseActionDescriptorString(token.content), context)
  }

  constructor(element: Element, index: number, descriptor: Partial<ActionDescriptor>, context: Context) {
    this.element = element
    this.index = index
    this.eventTargetName = descriptor.eventTargetName
    this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name")
    this.eventOptions = descriptor.eventOptions || {}
    this.identifier = descriptor.identifier || error("missing identifier")
    this.methodName = descriptor.methodName || error("missing method name")
    this.keyFilter = descriptor.keyFilter || ""
    this.context = context
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

  get schema() {
    return this.context.schema
  }

  get eventTargets(): EventTarget[] {
    if (this.eventTargetName == "window") {
      return [window]
    } else if (this.eventTargetName == "document") {
      return [document]
    } else if (typeof this.eventTargetName == "string") {
      return this.context.controller.outlets.findAll(this.eventTargetName)
    } else {
      return [this.element]
    }
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
