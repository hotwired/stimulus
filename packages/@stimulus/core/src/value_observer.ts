import { Context } from "./context"
import { StringMapObserver, StringMapObserverDelegate } from "@stimulus/mutation-observers"
import { ValueDescriptor } from "./value_properties"

export class ValueObserver implements StringMapObserverDelegate {
  readonly context: Context
  readonly receiver: any
  private stringMapObserver: StringMapObserver
  private valueDescriptorMap: { [attributeName: string]: ValueDescriptor }

  constructor(context: Context, receiver: any) {
    this.context = context
    this.receiver = receiver
    this.stringMapObserver = new StringMapObserver(this.element, this)
    this.valueDescriptorMap = (this.controller as any).valueDescriptorMap
    this.invokeChangedCallbacksForDefaultValues()
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
    if (attributeName in this.valueDescriptorMap) {
      return this.valueDescriptorMap[attributeName].name
    }
  }

  stringMapValueChanged(attributeValue: string | null, name: string) {
    this.invokeChangedCallbackForValue(name)
  }

  private invokeChangedCallbacksForDefaultValues() {
    for (const { key, name, defaultValue } of this.valueDescriptors) {
      if (defaultValue != undefined && !this.controller.data.has(key)) {
        this.invokeChangedCallbackForValue(name)
      }
    }
  }

  private invokeChangedCallbackForValue(name: string) {
    const methodName = `${name}Changed`
    const method = this.receiver[methodName]
    if (typeof method == "function") {
      const value = this.receiver[name]
      method.call(this.receiver, value)
    }
  }

  private get valueDescriptors() {
    const { valueDescriptorMap } = this
    return Object.keys(valueDescriptorMap).map(key => valueDescriptorMap[key])
  }
}
