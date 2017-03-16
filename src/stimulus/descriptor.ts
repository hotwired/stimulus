export class Descriptor {
  eventName: string | null
  methodName: string
  preventsDefault: boolean

  static parse(descriptorString: string): Descriptor {
    const matches = descriptorString.match(/^\s*(@)?\s*((.+?)\s*->)?\s*(.+)\s*$/)
    if (matches) {
      const eventName = matches[3]
      const methodName = matches[4]
      const preventsDefault = matches[1] ? false : true

      return new this(eventName, methodName, preventsDefault)
    }

    throw new Error(`Invalid descriptor: "${descriptorString}"`)
  }

  constructor(eventName: string | null, methodName: string, preventsDefault: boolean) {
    this.eventName = eventName
    this.methodName = methodName
    this.preventsDefault = preventsDefault
  }

  toString(): string {
    return (this.preventsDefault ? "@" : "") +
      (this.eventName != null ? this.eventName + "->" : "") +
      (this.methodName)
  }
}
