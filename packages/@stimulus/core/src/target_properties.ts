import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArrayValues } from "./inheritable_statics"
import { capitalize } from "./string_helpers"

/** @hidden */
export function TargetPropertiesBlessing<T>(constructor: Constructor<T>) {
  const targets = readInheritableStaticArrayValues(constructor, "targets")
  return targets.reduce((properties, targetDefinition) => {
    return Object.assign(properties, propertiesForTargetDefinition(targetDefinition))
  }, {} as PropertyDescriptorMap)
}

function propertiesForTargetDefinition(name: string) {
  return {
    [`${name}Target`]: {
      get(this: Controller) {
        const target = this.targets.find(name)
        if (target) {
          return target
        } else {
          throw new Error(`Missing target element "${this.identifier}.${name}"`)
        }
      }
    },

    [`${name}Targets`]: {
      get(this: Controller) {
        return this.targets.findAll(name)
      }
    },

    [`has${capitalize(name)}Target`]: {
      get(this: Controller) {
        return this.targets.has(name)
      }
    }
  }
}
