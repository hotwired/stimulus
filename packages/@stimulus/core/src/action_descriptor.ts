export interface ActionDescriptorOptions {
  identifier?: string
  eventName?: string
  methodName?: string
}

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

  static forOptions(options: ActionDescriptorOptions): ActionDescriptor {
    return new ActionDescriptor(
      options.identifier || error("Missing identifier in action descriptor"),
      options.eventName  || error("Missing event name in action descriptor"),
      options.methodName || error("Missing method name in action descriptor"),
    )
  }

  static forElementWithInlineDescriptorString(element: Element, descriptorString: string): ActionDescriptor {
    try {
      const options = this.parseOptionsFromInlineActionDescriptorString(descriptorString)
      options.eventName = options.eventName || this.getDefaultEventNameForElement(element)
      return ActionDescriptor.forOptions(options)
    } catch (error) {
      throw new Error(`Bad action descriptor "${descriptorString}": ${error.message}`)
    }
  }

  private static parseOptionsFromInlineActionDescriptorString(descriptorString: string): ActionDescriptorOptions {
    const source = descriptorString.trim()
    const matches = source.match(/^((.+?)->)?(.+?)#(.+)$/) || error("Invalid action descriptor syntax")
    return {
      identifier: matches[3],
      eventName: matches[2],
      methodName: matches[4]
    }
  }

  private static getDefaultEventNameForElement(element) {
    return this.defaultEventNames[element.tagName.toLowerCase()](element)
  }

  constructor(identifier: string, eventName: string, methodName: string) {
    this.identifier = identifier
    this.eventName = eventName
    this.methodName = methodName
  }

  isEqualTo(descriptor: ActionDescriptor | null): boolean {
    return descriptor != null &&
      descriptor.identifier == this.identifier &&
      descriptor.eventName == this.eventName &&
      descriptor.methodName == this.methodName
  }

  toString(): string {
    return `${this.eventName}->${this.identifier}#${this.methodName}`
  }
}

function error(message: string): never {
  throw new Error(message)
}
