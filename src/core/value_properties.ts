import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticObjectPairs } from "./inheritable_statics"
import { camelize, capitalize, dasherize } from "./string_helpers"
import { isSomething, hasProperty } from "./utils"

export function ValuePropertiesBlessing<T>(constructor: Constructor<T>) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs<T, ValueTypeDefinition>(constructor, "values")
  const propertyDescriptorMap: PropertyDescriptorMap = {
    valueDescriptorMap: {
      get(this: Controller) {
        return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
          const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier)
          const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key)
          return Object.assign(result, { [attributeName]: valueDescriptor })
        }, {} as ValueDescriptorMap)
      },
    },
  }

  return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
    return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair))
  }, propertyDescriptorMap)
}

export function propertiesForValueDefinitionPair<T>(
  valueDefinitionPair: ValueDefinitionPair,
  controller?: string
): PropertyDescriptorMap {
  const definition = parseValueDefinitionPair(valueDefinitionPair, controller)
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
      },
    },

    [`has${capitalize(name)}`]: {
      get(this: Controller): boolean {
        return this.data.has(key) || definition.hasCustomDefaultValue
      },
    },
  }
}

export type ValueDescriptor = {
  type: ValueType
  key: string
  name: string
  defaultValue: ValueTypeDefault
  hasCustomDefaultValue: boolean
  reader: Reader
  writer: Writer
}

export type ValueDescriptorMap = { [attributeName: string]: ValueDescriptor }

export type ValueDefinitionMap = { [token: string]: ValueTypeDefinition }

export type ValueDefinitionPair = [string, ValueTypeDefinition]

export type ValueTypeConstant = typeof Array | typeof Boolean | typeof Number | typeof Object | typeof String

export type ValueTypeDefault = Array<any> | boolean | number | Object | string

export type ValueTypeObject = Partial<{ type: ValueTypeConstant; default: ValueTypeDefault }>

export type ValueTypeDefinition = ValueTypeConstant | ValueTypeDefault | ValueTypeObject

export type ValueType = "array" | "boolean" | "number" | "object" | "string"

function parseValueDefinitionPair([token, typeDefinition]: ValueDefinitionPair, controller?: string): ValueDescriptor {
  return valueDescriptorForTokenAndTypeDefinition({
    controller,
    token,
    typeDefinition,
  })
}

export function parseValueTypeConstant(constant?: ValueTypeConstant) {
  switch (constant) {
    case Array:
      return "array"
    case Boolean:
      return "boolean"
    case Number:
      return "number"
    case Object:
      return "object"
    case String:
      return "string"
  }
}

export function parseValueTypeDefault(defaultValue?: ValueTypeDefault) {
  switch (typeof defaultValue) {
    case "boolean":
      return "boolean"
    case "number":
      return "number"
    case "string":
      return "string"
  }

  if (Array.isArray(defaultValue)) return "array"
  if (Object.prototype.toString.call(defaultValue) === "[object Object]") return "object"
}

type ValueTypeObjectPayload = {
  controller?: string
  token: string
  typeObject: ValueTypeObject
}

export function parseValueTypeObject(payload: ValueTypeObjectPayload) {
  const { controller, token, typeObject } = payload

  const hasType = isSomething(typeObject.type)
  const hasDefault = isSomething(typeObject.default)

  const fullObject = hasType && hasDefault
  const onlyType = hasType && !hasDefault
  const onlyDefault = !hasType && hasDefault

  const typeFromObject = parseValueTypeConstant(typeObject.type)
  const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default)

  if (onlyType) return typeFromObject
  if (onlyDefault) return typeFromDefaultValue

  if (typeFromObject !== typeFromDefaultValue) {
    const propertyPath = controller ? `${controller}.${token}` : token

    throw new Error(
      `The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`
    )
  }

  if (fullObject) return typeFromObject
}

type ValueTypeDefinitionPayload = {
  controller?: string
  token: string
  typeDefinition: ValueTypeDefinition
}

export function parseValueTypeDefinition(payload: ValueTypeDefinitionPayload): ValueType {
  const { controller, token, typeDefinition } = payload

  const typeObject = { controller, token, typeObject: typeDefinition as ValueTypeObject }

  const typeFromObject = parseValueTypeObject(typeObject as ValueTypeObjectPayload)
  const typeFromDefaultValue = parseValueTypeDefault(typeDefinition as ValueTypeDefault)
  const typeFromConstant = parseValueTypeConstant(typeDefinition as ValueTypeConstant)

  const type = typeFromObject || typeFromDefaultValue || typeFromConstant

  if (type) return type

  const propertyPath = controller ? `${controller}.${typeDefinition}` : token

  throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`)
}

export function defaultValueForDefinition(typeDefinition: ValueTypeDefinition): ValueTypeDefault {
  const constant = parseValueTypeConstant(typeDefinition as ValueTypeConstant)
  if (constant) return defaultValuesByType[constant]

  const hasDefault = hasProperty(typeDefinition, "default")
  const hasType = hasProperty(typeDefinition, "type")
  const typeObject = typeDefinition as ValueTypeObject

  if (hasDefault) return typeObject.default!

  if (hasType) {
    const { type } = typeObject
    const constantFromType = parseValueTypeConstant(type)

    if (constantFromType) return defaultValuesByType[constantFromType]
  }

  return typeDefinition
}

function valueDescriptorForTokenAndTypeDefinition(payload: ValueTypeDefinitionPayload) {
  const { token, typeDefinition } = payload

  const key = `${dasherize(token)}-value`
  const type = parseValueTypeDefinition(payload)
  return {
    type,
    key,
    name: camelize(key),
    get defaultValue() {
      return defaultValueForDefinition(typeDefinition)
    },
    get hasCustomDefaultValue() {
      return parseValueTypeDefault(typeDefinition) !== undefined
    },
    reader: readers[type],
    writer: writers[type] || writers.default,
  }
}

const defaultValuesByType = {
  get array() {
    return []
  },
  boolean: false,
  number: 0,
  get object() {
    return {}
  },
  string: "",
}

type Reader = (value: string) => any

const readers: { [type: string]: Reader } = {
  array(value: string): any[] {
    const array = JSON.parse(value)
    if (!Array.isArray(array)) {
      throw new TypeError(
        `expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`
      )
    }
    return array
  },

  boolean(value: string): boolean {
    return !(value == "0" || String(value).toLowerCase() == "false")
  },

  number(value: string): number {
    return Number(value.replace(/_/g, ""))
  },

  object(value: string): object {
    const object = JSON.parse(value)
    if (object === null || typeof object != "object" || Array.isArray(object)) {
      throw new TypeError(
        `expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`
      )
    }
    return object
  },

  string(value: string): string {
    return value
  },
}

type Writer = (value: any) => string

const writers: { [type: string]: Writer } = {
  default: writeString,
  array: writeJSON,
  object: writeJSON,
}

function writeJSON(value: any) {
  return JSON.stringify(value)
}

function writeString(value: any) {
  return `${value}`
}
