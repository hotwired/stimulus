import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArray } from "./inheritable_static_array"
import { capitalize } from "./string_helpers"

/** @hidden */
export function ValuePropertiesBlessing<T>(constructor: Constructor<T>) {
  const valueDefinitions = readInheritableStaticArray<T, ValueDefinition>(constructor, "values")
  const propertyDescriptorMap: PropertyDescriptorMap = {
    valueDescriptorMap: {
      get(this: Controller) {
        return valueDefinitions.reduce((result, valueDefinition) => {
          const valueDescriptor = parseValueDefinition(valueDefinition)
          const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key)
          return Object.assign(result, { [attributeName]: valueDescriptor })
        }, {} as ValueDescriptorMap)
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
  const read = readers[type], write = writers[type] || writers.default

  return {
    [name]: {
      get: defaultValue == undefined
        ? getOrThrow(key, read)
        : getWithDefault(key, read, defaultValue),

      set(this: Controller, value: T | undefined) {
        if (value == undefined) {
          this.data.delete(key)
        } else {
          this.data.set(key, write(value))
        }
      }
    },

    [`has${capitalize(name)}`]: {
      get(this: Controller): boolean {
        return defaultValue != undefined || this.data.has(key)
      }
    }
  }
}

export type ValueDescriptor = {
  key: string,
  name: string,
  type: "boolean" | "date" | "number" | "string",
  defaultValue: any
}

export type ValueDescriptorMap = { [attributeName: string]: ValueDescriptor }

export type ValueDefinition = string | Partial<ValueDescriptor>

function parseValueDefinition(valueDefinition: ValueDefinition): ValueDescriptor {
  const key = typeof valueDefinition == "string" ? valueDefinition : valueDefinition.name
  if (!key) throw new Error("missing key")
  return {
    key,
    name: `${key}Value`,
    type: typeof valueDefinition == "string" ? "string" : valueDefinition.type || "string",
    defaultValue: typeof valueDefinition == "string" ? undefined : valueDefinition.defaultValue
  }
}

function getWithDefault<T>(key: string, read: Reader, defaultValue: T) {
  return function(this: Controller): T {
    const value = this.data.get(key)
    return value == null ? defaultValue : read(value)
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

  date(value: string): Date {
    const numericValue = Number(value)
    const date = new Date(isNaN(numericValue) ? value : numericValue)

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date "${value}"`)
    } else {
      return date
    }
  },

  number(value: string): number {
    return parseFloat(value)
  },

  string(value: string): string {
    return value
  }
}

type Writer = (value: any) => string

const writers: { [type: string]: Writer } = {
  date(value: any) {
    if (value && typeof value.toISOString == "function") {
      return value.toISOString()
    } else {
      return `${value}`
    }
  },

  default(value: any) {
    return `${value}`
  }
}
