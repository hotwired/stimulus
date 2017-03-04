export class Descriptor {
  eventName: string | null
  methodName: string
  allowsDefault: boolean

  static parse(descriptorString: string): Descriptor {
    const matches = descriptorString.match(/^\s*(@)?\s*((.+?)\s*->)?\s*(.+)\s*$/)
    if (matches) {
      const eventName = matches[3]
      const methodName = matches[4]
      const allowsDefault = matches[1]

      return new this(eventName, methodName, allowsDefault ? true : false)
    }

    throw new Error(`Invalid descriptor: "${descriptorString}"`)
  }

  constructor(eventName: string | null, methodName: string, allowsDefault: boolean = false) {
    this.eventName = eventName
    this.methodName = methodName
    this.allowsDefault = allowsDefault
  }

  toString(): string {
    return (this.allowsDefault ? "@" : "") +
      (this.eventName != null ? this.eventName + "->" : "") +
      (this.methodName)
  }
}
