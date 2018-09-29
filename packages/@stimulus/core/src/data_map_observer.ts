import { Context } from "./context"
import { StringMapObserver, StringMapObserverDelegate } from "@stimulus/mutation-observers"
import { camelize } from "./string_helpers"

export class DataMapObserver implements StringMapObserverDelegate {
  readonly context: Context
  readonly receiver: any
  private stringMapObserver: StringMapObserver

  constructor(context: Context, receiver: any) {
    this.context = context
    this.receiver = receiver
    this.stringMapObserver = new StringMapObserver(this.element, this)
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

  get identifier() {
    return this.context.identifier
  }

  // String map observer delegate

  getStringMapKeyForAttribute(attributeName: string) {
    if (attributeName.startsWith(this.prefix)) {
      const name = attributeName.slice(this.prefix.length)
      return camelize(name)
    }
  }

  stringMapValueChanged(value: string | null, key: string) {
    const methodName = `${key}Changed`
    const method = this.receiver[methodName]
    if (typeof method == "function") {
      method.call(this.receiver, value)
    }
  }

  private get prefix() {
    return `data-${this.identifier}-`
  }
}
