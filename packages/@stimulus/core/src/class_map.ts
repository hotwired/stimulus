import { parseClassDescriptorStringForIdentifier } from "./class_descriptor"
import { Scope } from "./scope"

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
      const descriptor = parseClassDescriptorStringForIdentifier(descriptorString, identifier)
      if (descriptor) {
        values[descriptor.name] = descriptor.className
      }
      return values
    }, {} as { [name: string]: string })
  }

  get descriptorStrings() {
    const value = this.element.getAttribute(this.classAttribute) || ""
    return value.split(/\s+/)
  }

  get classAttribute() {
    return this.schema.classAttribute
  }

  get schema() {
    return this.scope.schema
  }

  get element() {
    return this.scope.element
  }

  get identifier() {
    return this.scope.identifier
  }
}
