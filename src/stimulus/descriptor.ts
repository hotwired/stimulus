export interface DescriptorOptions {
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

  targetName: string | null
  eventName: string
  methodName: string
  preventsDefault: boolean

  static forOptions(options: DescriptorOptions): Descriptor {
    return new Descriptor(
      options.targetName || null,
      options.eventName  || error("Missing event name in descriptor"),
      options.methodName || error("Missing method name in descriptor"),
      options.preventsDefault || false
    )
  }

  static forDescriptorString(descriptorString: string): Descriptor {
    try {
      const options = this.parseOptionsFromDescriptorString(descriptorString)
      return Descriptor.forOptions(options)
    } catch (error) {
      throw new Error(`Invalid descriptor "${descriptorString}": ${error.message}`)
    }
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

  private static parseOptionsFromDescriptorString(descriptorString: string): DescriptorOptions {
    const source = descriptorString.trim()
    const matches = source.match(/^(~)?(\[(.+?)\])?(.+)->(.+)$/) || error("Invalid descriptor syntax")
    return {
      targetName: matches[3],
      eventName: matches[4],
      methodName: matches[5],
      preventsDefault: matches[1] ? false : true
    }
  }

  private static parseOptionsFromInlineActionDescriptorString(descriptorString: string): DescriptorOptions {
    const source = descriptorString.trim()
    const matches = source.match(/^(~)?((.+?)->)?(.+)$/) || error("Invalid descriptor syntax")
    return {
      eventName: matches[3],
      methodName: matches[4],
      preventsDefault: matches[1] ? false : true
    }
  }

  private static getDefaultEventNameForElement(element) {
    return this.defaultEventNames[element.tagName.toLowerCase()](element)
  }

  constructor(targetName: string | null, eventName: string, methodName: string, preventsDefault: boolean) {
    this.targetName = targetName
    this.eventName = eventName
    this.methodName = methodName
    this.preventsDefault = preventsDefault
  }

  isEqualTo(descriptor: Descriptor | null): boolean {
    return descriptor != null &&
      descriptor.targetName == this.targetName &&
      descriptor.eventName == this.eventName &&
      descriptor.methodName == this.methodName &&
      descriptor.preventsDefault == this.preventsDefault
  }

  toString(): string {
    return (this.preventsDefault ? "" : "~") +
      this.eventName + "->" + this.methodName
  }
}

function error(message: string): never {
  throw new Error(message)
}
