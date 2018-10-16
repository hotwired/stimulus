import { Context } from "./context"
import { StringMapObserver, StringMapObserverDelegate } from "@stimulus/mutation-observers"

export class ValueObserver implements StringMapObserverDelegate {
  readonly context: Context
  readonly receiver: any
  private stringMapObserver: StringMapObserver
  private keysByAttributeName: { [attributeName: string]: string }

  constructor(context: Context, receiver: any) {
    this.context = context
    this.receiver = receiver
    this.stringMapObserver = new StringMapObserver(this.element, this)
    this.keysByAttributeName = this.getKeysByAttributeName()
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
    return this.keysByAttributeName[attributeName]
  }

  stringMapValueChanged(attributeValue: string | null, key: string) {
    const methodName = `${key}Changed`
    const method = this.receiver[methodName]
    if (typeof method == "function") {
      const value = this.receiver[key]
      method.call(this.receiver, value)
    }
  }

  private getKeysByAttributeName() {
    return Object.keys(this.valueAttributeMap).reduce((keys, attributeName) => {
      return { ...keys, [this.valueAttributeMap[attributeName]]: attributeName }
    }, {} as { [attributeName: string]: string })
  }

  private get valueAttributeMap() {
    return (this.controller as any).valueAttributeMap
  }
}
