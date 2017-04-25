export interface DescriptorOptions {
  identifier?: string
  targetName?: string
  eventName?: string
  methodName?: string
  preventsDefault?: boolean
}

export class Descriptor {
  private static defaultEventNames: { [tagName: string]: (element: Element) => string } = {
    "a":        e => "click",
    "button":   e => "click",
    "form":     e => "submit",
    "input":    e => e.getAttribute("type") == "submit" ? "click" : "change",
    "select":   e => "change",
    "textarea": e => "change"
  }

  identifier: string
  targetName: string | null
  eventName: string
  methodName: string
  preventsDefault: boolean

  static forOptions(options: DescriptorOptions): Descriptor {
    return new Descriptor(
      options.identifier || error("Missing identifier in descriptor"),
      options.targetName || null,
      options.eventName  || error("Missing event name in descriptor"),
      options.methodName || error("Missing method name in descriptor"),
      options.preventsDefault || false
    )
  }

  static forElementWithInlineDescriptorString(element: Element, descriptorString: string): Descriptor {
    try {
      const options = this.parseOptionsFromInlineActionDescriptorString(descriptorString)
      options.eventName = options.eventName || this.getDefaultEventNameForElement(element)
      return Descriptor.forOptions(options)
    } catch (error) {
      throw new Error(`Invalid descriptor "${descriptorString}": ${error.message}`)
    }
  }

  private static parseOptionsFromInlineActionDescriptorString(descriptorString: string): DescriptorOptions {
    const source = descriptorString.trim()
    const matches = source.match(/^(~)?((.+?)->)?(.+?)#(.+)$/) || error("Invalid descriptor syntax")
    return {
      identifier: matches[4],
      eventName: matches[3],
      methodName: matches[5],
      preventsDefault: matches[1] ? false : true
    }
  }

  private static getDefaultEventNameForElement(element) {
    return this.defaultEventNames[element.tagName.toLowerCase()](element)
  }

  constructor(identifier: string, targetName: string | null, eventName: string, methodName: string, preventsDefault: boolean) {
    this.identifier = identifier
    this.targetName = targetName
    this.eventName = eventName
    this.methodName = methodName
    this.preventsDefault = preventsDefault
  }

  isEqualTo(descriptor: Descriptor | null): boolean {
    return descriptor != null &&
      descriptor.identifier == this.identifier &&
      descriptor.targetName == this.targetName &&
      descriptor.eventName == this.eventName &&
      descriptor.methodName == this.methodName &&
      descriptor.preventsDefault == this.preventsDefault
  }

  toString(): string {
    return (this.preventsDefault ? "" : "~") +
      `${this.eventName}->${this.identifier}#${this.methodName}`
  }
}

function error(message: string): never {
  throw new Error(message)
}
