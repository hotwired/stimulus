import { BasicController } from "./basic_controller"
import { blessed } from "./blessing"
import { Constructor, getAncestorsForConstructor } from "./class"
import { readInheritableStaticObjectPairs } from "./inheritable_statics"
import { Mixin } from "./mixin"
import { camelize, capitalize, dasherize } from "./string_helpers"

const Values = Mixin
  .forConstructor(BasicController)
  .define(base =>
    class Values extends base {
      get valueDescriptorMap() {
        const descriptors = getValueDescriptorsForConstructor(this.constructor)
        return descriptors.reduce((result, descriptor) => {
          const attributeName = this.data.getAttributeNameForKey(descriptor.key)
          return { ...result, [attributeName]: descriptor }
        }, {} as ValueDescriptorMap)
      }
    }
  )

export const BlessedValueProperties = Values
  .define(base =>
    blessed(
      class BlessedValues extends base {
        static values: ValueDefinitionMap
      },

      base => {
        const valueDefinitionPairs = readInheritableStaticObjectPairs<ValueTypeConstant>(base, "values")
        return valueDefinitionPairs.reduce((extended, [name, type]) => {
          return mixinForValue(name, type).extends(extended)
        }, base)
      }
    )
  )

export const ValuePropertiesMacro = Values
  .define(base =>
    class ValueMacro extends base {
      static value<T extends typeof ValueMacro, S extends string, V extends ValueTypeConstant>(this: T, token: S, typeConstant: V) {
        return this.uses(mixinForValue(token, typeConstant))
      }
    }
  )

const valueDescriptorsByConstructor = new WeakMap<Constructor, ValueDescriptor>()

function registerValueDescriptorForConstructor<C extends Constructor>(constructor: C, descriptor: ValueDescriptor): C {
  valueDescriptorsByConstructor.set(constructor, descriptor)
  return constructor
}

function getValueDescriptorsForConstructor(constructor: any) {
  const ancestors = getAncestorsForConstructor(constructor)
  return ancestors.reduce((result, ancestor) => {
    const descriptor = valueDescriptorsByConstructor.get(ancestor)
    return descriptor ? [ ...result, descriptor ] : result
  }, [] as ValueDescriptor[])
}

function mixinForValue<T extends string, V extends ValueTypeConstant>(token: T, typeConstant: V) {
  type Value = ParseValueTypeConstant<V>
  const definition = definitionForValue(token, typeConstant)
  const { key, name, type } = definition

  const descriptor = valueDescriptorForTokenAndType(token, type)
  const read: Reader<Value> = readers[type]
  const write: Writer<Value> = writers[type] || writers.default

  return Mixin
    .forMixin(Values)
    .define(base => {
      return registerValueDescriptorForConstructor(base, descriptor)
    })
    .defineSetter(name, function(value?: Value) {
      if (value === undefined) {
        this.data.delete(key)
      } else {
        this.data.set(key, write(value as any))
      }
    })
    .defineGetter(name, function(): Value {
      const value = this.data.get(key)
      if (value !== null) {
        return read(value)
      } else {
        return definition.defaultValue as any
      }
    })
    .defineGetter(`has${capitalize(name)}` as const, function() {
      return this.data.has(key)
    })
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

function definitionForValue<T extends string, V extends ValueTypeConstant>(token: T, typeConstant: V) {
  const type = parseValueTypeConstant(typeConstant)
  return valueDescriptorForTokenAndType(token, type)
}

export type ParseValueTypeConstant<V extends ValueTypeConstant>
  = V extends typeof Array
    ? any[]
    : V extends typeof Boolean
      ? boolean
      : V extends typeof Number
        ? number
        : V extends typeof Object
          ? object
          : V extends typeof String
            ? string
            : never

function parseValueTypeConstant<V extends ValueTypeConstant>(typeConstant: V): ValueType {
  switch (typeConstant) {
    case Array:   return "array"
    case Boolean: return "boolean"
    case Number:  return "number"
    case Object:  return "object"
    case String:  return "string"
  }
  throw new Error(`Unknown value type constant "${typeConstant}"`)
}

function valueDescriptorForTokenAndType<T extends string>(token: T, type: ValueType) {
  return {
    type,
    name: `${camelize(token)}Value` as const,
    key: `${dasherize(token)}-value`,
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

type Reader<T = any> = (value: string) => T

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

type Writer<T = any> = (value: T | undefined) => string

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
