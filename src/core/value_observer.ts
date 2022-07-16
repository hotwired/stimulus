import { Context } from "./context"
import { StringMapObserver, StringMapObserverDelegate } from "../mutation-observers"
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
  }

  start() {
    this.stringMapObserver.start()
    this.invokeChangedCallbacksForDefaultValues()
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
      this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue))
    }
  }

  stringMapValueChanged(value: string, name: string, oldValue: string) {
    const descriptor = this.valueDescriptorNameMap[name]

    if (value === null) return

    if (oldValue === null) {
      oldValue = descriptor.writer(descriptor.defaultValue)
    }

    this.invokeChangedCallback(name, value, oldValue)
  }

  stringMapKeyRemoved(key: string, attributeName: string, oldValue: string) {
    const descriptor = this.valueDescriptorNameMap[key]

    if (this.hasValue(key)) {
      this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue)
    } else {
      this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue)
    }
  }

  private invokeChangedCallbacksForDefaultValues() {
    for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
      if (defaultValue != undefined && !this.controller.data.has(key)) {
        this.invokeChangedCallback(name, writer(defaultValue), undefined)
      }
    }
  }

  private invokeChangedCallback(name: string, rawValue: string, rawOldValue: string | undefined) {
    const changedMethodName = `${name}Changed`
    const changedMethod = this.receiver[changedMethodName]

    if (typeof changedMethod == "function") {
      const descriptor = this.valueDescriptorNameMap[name]

      try {
        const value = descriptor.reader(rawValue)
        let oldValue = rawOldValue

        if (rawOldValue) {
          oldValue = descriptor.reader(rawOldValue)
        }

        changedMethod.call(this.receiver, value, oldValue)
      } catch (error) {
        if (!(error instanceof TypeError)) throw error

        throw new TypeError(`Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error.message}`)
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
