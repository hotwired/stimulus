import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticObjectPairs } from "./inheritable_statics"
import { camelize, capitalize, dasherize } from "./string_helpers"

/** @hidden */
export function ValuePropertiesBlessing<T>(constructor: Constructor<T>) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs<T, ValueTypeConstant>(constructor, "values")
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
  const definition = parseValueDefinitionPair(valueDefinitionPair)
  const { type, key, name } = definition
  const read = readers[type], write = writers[type] || writers.default

  return {
    [name]: {
      get(this: Controller) {
        const value = this.data.get(key)
        if (value !== null) {
          return read(value)
        } else {
          return definition.defaultValue
        }
      },

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
        return this.data.has(key)
      }
    }
  }
}

export type ValueDescriptor = {
  type: ValueType,
  key: string,
  name: string,
  defaultValue: any
}

export type ValueDescriptorMap = { [attributeName: string]: ValueDescriptor }

export type ValueDefinitionMap = { [token: string]: ValueTypeConstant }

export type ValueDefinitionPair = [string, ValueTypeConstant]

export type ValueTypeConstant = typeof Array | typeof Boolean | typeof Number | typeof Object | typeof String

export type ValueType = "array" | "boolean" | "number" | "object" | "string"

function parseValueDefinitionPair([token, typeConstant]: ValueDefinitionPair): ValueDescriptor {
  const type = parseValueTypeConstant(typeConstant)
  return valueDescriptorForTokenAndType(token, type)
}

function parseValueTypeConstant(typeConstant: ValueTypeConstant) {
  switch (typeConstant) {
    case Array:   return "array"
    case Boolean: return "boolean"
    case Number:  return "number"
    case Object:  return "object"
    case String:  return "string"
  }
  throw new Error(`Unknown value type constant "${typeConstant}"`)
}

function valueDescriptorForTokenAndType(token: string, type: ValueType) {
  const key = `${dasherize(token)}-value`
  return {
    type,
    key,
    name: camelize(key),
    get defaultValue() { return defaultValuesByType[type] }
  }
}

const defaultValuesByType = {
  get array() { return [] },
  boolean: false,
  number: 0,
  get object() { return {} },
  string: ""
}

type Reader = (value: string) => any

const readers: { [type: string]: Reader } = {
  array(value: string): any[] {
    const array = JSON.parse(value)
    if (!Array.isArray(array)) {
      throw new TypeError("Expected array")
    }
    return array
  },

  boolean(value: string): boolean {
    return !(value == "0" || value == "false")
  },

  number(value: string): number {
    return parseFloat(value)
  },

  object(value: string): object {
    const object = JSON.parse(value)
    if (object === null || typeof object != "object" || Array.isArray(object)) {
      throw new TypeError("Expected object")
    }
    return object
  },

  string(value: string): string {
    return value
  }
}

type Writer = (value: any) => string

const writers: { [type: string]: Writer } = {
  default: writeString,
  array: writeJSON,
  object: writeJSON
}

function writeJSON(value: any) {
  return JSON.stringify(value)
}

function writeString(value: any) {
  return `${value}`
}
