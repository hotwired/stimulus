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
          const { classAttribute } = classes
          throw new Error(`Missing class descriptor for property "${name}" in attribute "${classAttribute}"`)
        }
      }
    },

    [`has${capitalize(key)}Class`]: {
      get(this: Controller) {
        return this.classes.has(key)
      }
    }
  }
}
