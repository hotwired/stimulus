import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticObjectPairs } from "./inheritable_statics"
import { capitalize } from "./string_helpers"

/** @hidden */
export function ValuePropertiesBlessing<T>(constructor: Constructor<T>) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs<T, ValueDefinition>(constructor, "values")
  const propertyDescriptorMap: PropertyDescriptorMap = {
    valueDescriptorMap: {
      get(this: Controller) {
        return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
          const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair)
          const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key)
          return Object.assign(result, { [attributeName]: valueDescriptor })
        }, {} as ValueDescriptorMap)
      }
    }
  }

  return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
    return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair))
  }, propertyDescriptorMap)
}

/** @hidden */
export function propertiesForValueDefinitionPair<T>(valueDefinitionPair: ValueDefinitionPair): PropertyDescriptorMap {
  const { key, name, type, defaultValue } = parseValueDefinitionPair(valueDefinitionPair)
  const read = readers[type], write = writers[type] || writers.default

  return {
    [name]: {
      get: defaultValue === undefined
        ? getOrThrow(key, read)
        : getWithDefault(key, read, defaultValue),

      set(this: Controller, value: T | undefined) {
        if (value === undefined) {
          this.data.delete(key)
        } else {
          this.data.set(key, write(value))
        }
      }
    },

    [`has${capitalize(name)}`]: {
      get(this: Controller): boolean {
        return defaultValue !== undefined || this.data.has(key)
      }
    }
  }
}

export type ValueDescriptor = {
  key: string,
  name: string,
  type: ValueType,
  defaultValue: any
}

export type ValueDescriptorMap = { [attributeName: string]: ValueDescriptor }

export type ValueDefinition = ValueTypeConstant | [ValueTypeConstant, any]

export type ValueDefinitionMap = { [key: string]: ValueDefinition }

export type ValueDefinitionPair = [string, ValueDefinition]

export type ValueType = "boolean" | "json" | "number" | "string"

export type ValueTypeConstant = typeof Boolean | typeof JSON | typeof Number | typeof String

function parseValueDefinitionPair([key, definition]: ValueDefinitionPair): ValueDescriptor {
  const { 0: typeConstant, 1: defaultValue }
    = Array.isArray(definition)
    ? definition
    : [definition, defaultValueForValueTypeConstant(definition)]
  return {
    key,
    name: `${key}Value`,
    type: parseValueTypeConstant(typeConstant),
    defaultValue
  }
}

function parseValueTypeConstant(typeConstant: ValueTypeConstant) {
  switch (typeConstant) {
    case Boolean: return "boolean"
    case JSON:    return "json"
    case Number:  return "number"
    case String:  return "string"
  }
  throw new Error(`Unknown value type constant "${typeConstant}"`)
}

function defaultValueForValueTypeConstant(typeConstant: ValueTypeConstant) {
  switch (typeConstant) {
    case Boolean: return false
    case Number:  return 0
    case String:  return ""
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

  json(value: string): any {
    return JSON.parse(value)
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
  json(value: any) {
    return JSON.stringify(value)
  },

  default(value: any) {
    return `${value}`
  }
}
