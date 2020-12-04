import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArrayValues } from "./inheritable_statics"
import { capitalize } from "./string_helpers"

/** @hidden */
export function ClassPropertiesBlessing<T>(constructor: Constructor<T>) {
  const classes = readInheritableStaticArrayValues(constructor, "classes")
  return classes.reduce((properties, classDefinition) => {
    return Object.assign(properties, propertiesForClassDefinition(classDefinition))
  }, {} as PropertyDescriptorMap)
}

function propertiesForClassDefinition(key: string) {
  const name = `${key}Class`

  return {
    [name]: {
      get(this: Controller) {
        const { classes } = this
        if (classes.has(key)) {
          return classes.get(key)
        } else {
          const attribute = classes.getAttributeName(key)
          throw new Error(`Missing attribute "${attribute}"`)
        }
      }
    },

    [`has${capitalize(name)}`]: {
      get(this: Controller) {
        return this.classes.has(key)
      }
    }
  }
}
