import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArray } from "./inheritable_static_array"
import { capitalize, dasherize } from "./string_helpers"

/** @hidden */
export function ClassPropertiesBlessing<T>(constructor: Constructor<T>) {
  const classes = readInheritableStaticArray(constructor, "classes")
  return classes.reduce((properties, classDefinition) => {
    return Object.assign(properties, propertiesForClassDefinition(classDefinition))
  }, {} as PropertyDescriptorMap)
}

function propertiesForClassDefinition(key: string) {
  const name = `${key}Class`, defaultName = `default${capitalize(name)}`

  return {
    [name]: {
      get(this: Controller) {
        if (this.data.has(key)) {
          return this.data.get(key)
        } else {
          return (this as any)[defaultName]
        }
      }
    },

    [defaultName]: {
      get(this: Controller) {
        return `${this.identifier}--${dasherize(key)}`
      }
    }
  }
}
