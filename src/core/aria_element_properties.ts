import { Controller } from "./controller"
import { Constructor } from "./constructor"
import { capitalize } from "./string_helpers"
import { AriaAttributeName, AriaPropertyName, forEachAriaMapping } from "./aria"

export function AriaElementPropertiesBlessing<T>(_constructor: Constructor<T>) {
  let properties: PropertyDescriptorMap = {}

  forEachAriaMapping((attributeName, propertyName) => {
    properties = Object.assign(properties, propertiesForAriaElementDefinition(attributeName, propertyName))
  })

  return properties
}

function propertiesForAriaElementDefinition(attributeName: AriaAttributeName, name: AriaPropertyName) {
  return {
    [`${name}Element`]: {
      get(this: Controller) {
        const element = this.ariaElements.find(attributeName)
        if (element) {
          return element
        } else {
          throw new Error(`Missing element referenced by "[${attributeName}]" for "${this.identifier}" controller`)
        }
      },
    },

    [`${name}Elements`]: {
      get(this: Controller) {
        return this.ariaElements.findAll(attributeName)
      },
    },

    [`has${capitalize(name)}Element`]: {
      get(this: Controller) {
        return this.ariaElements.has(attributeName)
      },
    },
  }
}
