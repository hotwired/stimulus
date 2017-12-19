export interface ActionDescriptorOptions {
  identifier?: string
  eventName?: string
  methodName?: string
  eventTarget?: EventTarget
}

// capture nos.:  12   23 4               43   1 5   5 6  6
const pattern = /^((.+?)(@(window|document))?->)?(.+?)#(.+)$/

export class ActionDescriptor {
  private static defaultEventNames: { [tagName: string]: (element: Element) => string } = {
    "a":        e => "click",
    "button":   e => "click",
    "form":     e => "submit",
    "input":    e => e.getAttribute("type") == "submit" ? "click" : "change",
    "select":   e => "change",
    "textarea": e => "change"
  }

  identifier: string
  eventName: string
  methodName: string
  eventTarget: EventTarget

  static forOptions(options: ActionDescriptorOptions): ActionDescriptor {
    return new ActionDescriptor(
      options.identifier  || error("Missing identifier in action descriptor"),
      options.eventName   || error("Missing event name in action descriptor"),
      options.methodName  || error("Missing method name in action descriptor"),
      options.eventTarget || error("Missing event target in action descriptor")
    )
  }

  static forElementWithInlineDescriptorString(element: Element, descriptorString: string): ActionDescriptor {
    try {
      const options = this.parseOptionsFromInlineActionDescriptorString(descriptorString)
      options.eventName = options.eventName || this.getDefaultEventNameForElement(element)
      options.eventTarget = options.eventTarget || element
      return ActionDescriptor.forOptions(options)
    } catch (error) {
      throw new Error(`Bad action descriptor "${descriptorString}": ${error.message}`)
    }
  }

  private static parseOptionsFromInlineActionDescriptorString(descriptorString: string): ActionDescriptorOptions {
    const source = descriptorString.trim()
    const matches = source.match(pattern) || error("Invalid action descriptor syntax")
    return {
      identifier:  matches[5],
      eventName:   matches[2],
      methodName:  matches[6],
      eventTarget: parseEventTarget(matches[4])
    }
  }

  private static getDefaultEventNameForElement(element) {
    return this.defaultEventNames[element.tagName.toLowerCase()](element)
  }

  constructor(identifier: string, eventName: string, methodName: string, eventTarget: EventTarget) {
    this.identifier = identifier
    this.eventName = eventName
    this.methodName = methodName
    this.eventTarget = eventTarget
  }

  get eventTargetName(): string | undefined {
    return stringifyEventTarget(this.eventTarget)
  }

  isEqualTo(descriptor: ActionDescriptor | null): boolean {
    return descriptor != null &&
      descriptor.identifier == this.identifier &&
      descriptor.eventName == this.eventName &&
      descriptor.methodName == this.methodName &&
      descriptor.eventTarget == this.eventTarget
  }

  toString(): string {
    const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : ""
    return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`
  }
}

function error(message: string): never {
  throw new Error(message)
}

function parseEventTarget(eventTargetName: string): EventTarget | undefined {
  if (eventTargetName == "window") {
    return window
  } else if (eventTargetName == "document") {
    return document
  }
}

function stringifyEventTarget(eventTarget?: EventTarget) {
  if (eventTarget == window) {
    return "window"
  } else if (eventTarget == document) {
    return "document"
  }
}
