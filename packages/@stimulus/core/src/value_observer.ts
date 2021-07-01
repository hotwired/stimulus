import { Context } from "./context"
import { StringMapObserver, StringMapObserverDelegate } from "@stimulus/mutation-observers"
import { ValueDescriptor } from "./value_properties"
import { capitalize } from "./string_helpers"

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

  stringMapKeyAdded(key: string, attributeName: string) {
    const descriptor = this.valueDescriptorMap[attributeName]

    if (!this.hasValue(key)) {
      this.invokeChangedCallbackForValue(key, descriptor.defaultValue as string)
    }
  }

  stringMapValueChanged(value: string | null, name: string, oldValue: string | null) {
    this.invokeChangedCallbackForValue(name, oldValue)
  }

  stringMapKeyRemoved(key: string, attributeName: string, oldValue: string | null) {
    if (this.hasValue(key)) {
      this.invokeChangedCallbackForValue(key, oldValue)
    }
  }

  private invokeChangedCallbacksForDefaultValues() {
    for (const { key, name, defaultValue } of this.valueDescriptors) {
      if (defaultValue != undefined && !this.controller.data.has(key)) {
        this.invokeChangedCallbackForValue(name, null)
      }
    }
  }

  private invokeChangedCallbackForValue(name: string, oldValue: string | null) {
    const changedMethodName = `${name}Changed`
    const changedMethod = this.receiver[changedMethodName]

    if (typeof changedMethod == "function") {
      const value = this.receiver[name]
      const descriptor = this.valueDescriptorNameMap[name]

      if (oldValue) {
        changedMethod.call(this.receiver, value, descriptor.reader(oldValue))
      } else if (this.hasValue(name)) {
        changedMethod.call(this.receiver, value, descriptor.defaultValue)
      } else {
        changedMethod.call(this.receiver, value)
      }
    }
  }

  private get valueDescriptors() {
    const { valueDescriptorMap } = this
    return Object.keys(valueDescriptorMap).map(key => valueDescriptorMap[key])
  }

  private get valueDescriptorNameMap() {
    const descriptors: { [type: string]: ValueDescriptor }  = {}

    Object.keys(this.valueDescriptorMap).forEach(key => {
      const descriptor = this.valueDescriptorMap[key]
      descriptors[descriptor.name] = descriptor
    })

    return descriptors
  }

  private hasValue(attributeName: string) {
    const descriptor = this.valueDescriptorNameMap[attributeName]
    const hasMethodName = `has${capitalize(descriptor.name)}`

    return this.receiver[hasMethodName]
  }
}
