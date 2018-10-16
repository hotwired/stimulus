import { Context } from "./context"
import { StringMapObserver, StringMapObserverDelegate } from "@stimulus/mutation-observers"
import { ValueDescriptor } from "./value_properties"

export class ValueObserver implements StringMapObserverDelegate {
  readonly context: Context
  readonly receiver: any
  private stringMapObserver: StringMapObserver
  private valueDescriptors: { [attributeName: string]: ValueDescriptor }

  constructor(context: Context, receiver: any) {
    this.context = context
    this.receiver = receiver
    this.stringMapObserver = new StringMapObserver(this.element, this)
    this.valueDescriptors = (this.controller as any).valueDescriptors
  }

  start() {
    this.stringMapObserver.start()
  }

  stop() {
    this.stringMapObserver.stop()
  }

  get element() {
    return this.context.element
  }

  get controller() {
    return this.context.controller
  }

  // String map observer delegate

  getStringMapKeyForAttribute(attributeName: string) {
    if (attributeName in this.valueDescriptors) {
      return this.valueDescriptors[attributeName].name
    }
  }

  stringMapValueChanged(attributeValue: string | null, key: string) {
    const methodName = `${key}Changed`
    const method = this.receiver[methodName]
    if (typeof method == "function") {
      const value = this.receiver[key]
      method.call(this.receiver, value)
    }
  }
}
