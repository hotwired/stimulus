import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticObjectPairs } from "./inheritable_statics"
import { camelize, capitalize, dasherize } from "./string_helpers"

export function ValuePropertiesBlessing<T>(constructor: Constructor<T>) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs<T, ValueTypeDefinition>(constructor, "values")
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

export function propertiesForValueDefinitionPair<T>(valueDefinitionPair: ValueDefinitionPair): PropertyDescriptorMap {
  const definition = parseValueDefinitionPair(valueDefinitionPair)
  const { key, name, reader: read, writer: write } = definition

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
        return this.data.has(key) || definition.hasCustomDefaultValue
      }
    }
  }
}

export type ValueDescriptor = {
  type: ValueType,
  key: string,
  name: string,
  defaultValue: ValueTypeDefault,
  hasCustomDefaultValue: boolean,
  reader: Reader,
  writer: Writer
}

export type ValueDescriptorMap = { [attributeName: string]: ValueDescriptor }

export type ValueDefinitionMap = { [token: string]: ValueTypeDefinition }

export type ValueDefinitionPair = [string, ValueTypeDefinition]

export type ValueTypeConstant = typeof Array | typeof Boolean | typeof Number | typeof Object | typeof String

export type ValueTypeDefault = Array<any> | Boolean | Number | Object | String

export type ValueTypeObject = { type: ValueTypeConstant, default: ValueTypeDefault }

export type ValueTypeDefinition = ValueTypeConstant | ValueTypeDefault | ValueTypeObject

export type ValueType = "array" | "boolean" | "number" | "object" | "string"

function parseValueDefinitionPair([token, typeDefinition]: ValueDefinitionPair): ValueDescriptor {
  return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition)
}

function parseValueTypeConstant(constant: ValueTypeConstant) {
  switch (constant) {
    case Array:   return "array"
    case Boolean: return "boolean"
    case Number:  return "number"
    case Object:  return "object"
    case String:  return "string"
  }
}

function parseValueTypeDefault(defaultValue: ValueTypeDefault) {
  switch (typeof defaultValue) {
    case "boolean": return "boolean"
    case "number":  return "number"
    case "string":  return "string"
  }

  if (Array.isArray(defaultValue)) return "array"
  if (Object.prototype.toString.call(defaultValue) === "[object Object]") return "object"
}

function parseValueTypeObject(typeObject: ValueTypeObject) {
  const typeFromObject = parseValueTypeConstant(typeObject.type)

  if (typeFromObject) {
    const defaultValueType = parseValueTypeDefault(typeObject.default)

    if (typeFromObject !== defaultValueType) {
      throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`)
    }

    return typeFromObject
  }
}

function parseValueTypeDefinition(typeDefinition: ValueTypeDefinition): ValueType {
  const typeFromObject = parseValueTypeObject(typeDefinition as ValueTypeObject)
  const typeFromDefaultValue = parseValueTypeDefault(typeDefinition as ValueTypeDefault)
  const typeFromConstant = parseValueTypeConstant(typeDefinition as ValueTypeConstant)

  const type = typeFromObject || typeFromDefaultValue || typeFromConstant
  if (type) return type

  throw new Error(`Unknown value type "${typeDefinition}"`)
}

function defaultValueForDefinition(typeDefinition: ValueTypeDefinition): ValueTypeDefault {
  const constant = parseValueTypeConstant(typeDefinition as ValueTypeConstant)

  if (constant) return defaultValuesByType[constant]

  const defaultValue = (typeDefinition as ValueTypeObject).default
  if (defaultValue !== undefined) return defaultValue

  return typeDefinition
}

function valueDescriptorForTokenAndTypeDefinition(token: string, typeDefinition: ValueTypeDefinition) {
  const key = `${dasherize(token)}-value`
  const type = parseValueTypeDefinition(typeDefinition)
  return {
    type,
    key,
    name: camelize(key),
    get defaultValue() { return defaultValueForDefinition(typeDefinition) },
    get hasCustomDefaultValue() { return parseValueTypeDefault(typeDefinition) !== undefined },
    reader: readers[type],
    writer: writers[type] || writers.default
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
    return Number(value)
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
