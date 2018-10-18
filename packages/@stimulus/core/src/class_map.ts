import { Scope } from "./scope"
import { parseDescriptorString } from "./class_descriptor"

export class ClassMap {
  readonly scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  has(name: string) {
    return name in this.values
  }

  get(name: string) {
    return this.values[name]
  }

  get values() {
    const { identifier } = this
    return this.descriptorStrings.reduce((values, descriptorString) => {
      const descriptor = parseDescriptorString(descriptorString)
      if (descriptor && descriptor.identifier == identifier) {
        values[descriptor.name] = descriptor.className
      }
      return values
    }, {} as { [name: string]: string })
  }

  get descriptorStrings() {
    const value = this.element.getAttribute("data-class") || ""
    return value.split(/\s+/)
  }

  get element() {
    return this.scope.element
  }

  get identifier() {
    return this.scope.identifier
  }
}
