import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArray } from "./inheritable_static_array"
import { dasherize } from "./string_helpers"
import { propertiesForValueDefinition } from "./value_properties"

/** @hidden */
export function ClassPropertiesBlessing<T>(constructor: Constructor<T>) {
  const classes = readInheritableStaticArray(constructor, "classes")
  return classes.reduce((properties, classDefinition) => {
    return Object.assign(properties, propertiesForClassDefinition(classDefinition))
  }, {} as PropertyDescriptorMap)
}

function propertiesForClassDefinition(name: string) {
  return propertiesForValueDefinition({
    name: `${name}Class`,
    type: "string",
    default(this: Controller) {
      return `${this.identifier}--${dasherize(name)}`
    }
  })
}
