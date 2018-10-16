import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArray } from "./inheritable_static_array"
import { capitalize } from "./string_helpers"

/** @hidden */
export function ValuePropertiesBlessing<T>(constructor: Constructor<T>) {
  const valueDefinitions = readInheritableStaticArray<T, ValueDefinition>(constructor, "values")
  const propertyDescriptorMap: PropertyDescriptorMap = {
    valueAttributeMap: {
      get(this: Controller) {
        return valueDefinitions.reduce((result, valueDefinition) => {
          const { name, key } = parseValueDefinition(valueDefinition)
          return { ...result, [name]: this.data.getAttributeNameForKey(key) }
        }, {})
      }
    }
  }

  return valueDefinitions.reduce((properties, valueDefinition) => {
    return Object.assign(properties, propertiesForValueDefinition(valueDefinition))
  }, propertyDescriptorMap)
}

/** @hidden */
export function propertiesForValueDefinition<T>(valueDefinition: ValueDefinition): PropertyDescriptorMap {
  const { name, key, type, defaultValue } = parseValueDefinition(valueDefinition)
  const getDefaultValue = defaultValue instanceof Function ? defaultValue : () => defaultValue
  const read = readers[type]

  return {
    [name]: {
      get: defaultValue == undefined
        ? getOrThrow(key, read)
        : getWithDefault(key, read, getDefaultValue),

      set(this: Controller, value: T | undefined) {
        if (value == undefined) {
          this.data.delete(key)
        } else {
          this.data.set(key, `${value}`)
        }
      }
    },

    [`has${capitalize(name)}`]: {
      get(this: Controller): boolean {
        return getDefaultValue.call(this) != undefined || this.data.has(key)
      }
    }
  }
}

type ValueDefinition = string | {
  name: string,
  type: "boolean" | "integer" | "float" | "string" | undefined,
  default: any
}

function parseValueDefinition(valueDefinition: ValueDefinition) {
  const key = typeof valueDefinition == "string" ? valueDefinition : valueDefinition.name
  const type = typeof valueDefinition == "string" ? "string" : valueDefinition.type || "string"
  const defaultValue = typeof valueDefinition == "string" ? undefined : valueDefinition.default
  const name = `${key}Value`
  return { name, key, type, defaultValue }
}

function getWithDefault<T>(key: string, read: Reader, getDefaultValue: () => T) {
  return function(this: Controller): T {
    const value = this.data.get(key)
    return value == null ? getDefaultValue.call(this) : read(value)
  }
}

function getOrThrow<T>(key: string, read: Reader) {
  return function(this: Controller): T {
    const value = this.data.get(key)
    if (value == null) {
      const attributeName = this.data.getAttributeNameForKey(key)
      throw new Error(`Missing required attribute "${attributeName}"`)
    }
    return read(value)
  }
}

type Reader = (value: string) => any

const readers: { [type: string]: Reader } = {
  boolean(value: string): boolean {
    return !(value == "0" || value == "false")
  },

  integer(value: string): number {
    return parseInt(value, 10)
  },

  float(value: string): number {
    return parseFloat(value)
  },

  string(value: string): string {
    return value
  }
}
