import { ValueController } from "../../controllers/value_controller"
import { ControllerTestCase } from "../../cases/controller_test_case"

import {
  parseValueTypeDefault,
  parseValueTypeConstant,
  parseValueTypeObject,
  parseValueTypeDefinition,
  defaultValueForDefinition,
} from "../../../core/value_properties"

export default class ValuePropertiesTests extends ControllerTestCase(ValueController) {
  "test parseValueTypeConstant"() {
    this.assert.equal(parseValueTypeConstant(String), "string")
    this.assert.equal(parseValueTypeConstant(Boolean), "boolean")
    this.assert.equal(parseValueTypeConstant(Array), "array")
    this.assert.equal(parseValueTypeConstant(Object), "object")
    this.assert.equal(parseValueTypeConstant(Number), "number")

    this.assert.equal(parseValueTypeConstant("" as any), undefined)
    this.assert.equal(parseValueTypeConstant({} as any), undefined)
    this.assert.equal(parseValueTypeConstant([] as any), undefined)
    this.assert.equal(parseValueTypeConstant(true as any), undefined)
    this.assert.equal(parseValueTypeConstant(false as any), undefined)
    this.assert.equal(parseValueTypeConstant(0 as any), undefined)
    this.assert.equal(parseValueTypeConstant(1 as any), undefined)
    this.assert.equal(parseValueTypeConstant(null!), undefined)
    this.assert.equal(parseValueTypeConstant(undefined), undefined)
  }

  "test parseValueTypeDefault"() {
    this.assert.equal(parseValueTypeDefault(""), "string")
    this.assert.equal(parseValueTypeDefault("Some string"), "string")

    this.assert.equal(parseValueTypeDefault(true), "boolean")
    this.assert.equal(parseValueTypeDefault(false), "boolean")

    this.assert.equal(parseValueTypeDefault([]), "array")
    this.assert.equal(parseValueTypeDefault([1, 2, 3]), "array")
    this.assert.equal(parseValueTypeDefault([true, false, true]), "array")
    this.assert.equal(parseValueTypeDefault([{}, {}, {}]), "array")

    this.assert.equal(parseValueTypeDefault({}), "object")
    this.assert.equal(parseValueTypeDefault({ one: "key" }), "object")

    this.assert.equal(parseValueTypeDefault(-1), "number")
    this.assert.equal(parseValueTypeDefault(0), "number")
    this.assert.equal(parseValueTypeDefault(1), "number")
    this.assert.equal(parseValueTypeDefault(-0.1), "number")
    this.assert.equal(parseValueTypeDefault(0.0), "number")
    this.assert.equal(parseValueTypeDefault(0.1), "number")

    this.assert.equal(parseValueTypeDefault(null!), undefined)
    this.assert.equal(parseValueTypeDefault(undefined!), undefined)
  }

  "test parseValueTypeObject"() {
    const typeObject = (object: any) => {
      return parseValueTypeObject({
        controller: this.controller.identifier,
        token: "url",
        typeObject: object,
      })
    }

    this.assert.equal(typeObject({ type: String, default: "" }), "string")
    this.assert.equal(typeObject({ type: String, default: "123" }), "string")
    this.assert.equal(typeObject({ type: String }), "string")
    this.assert.equal(typeObject({ default: "" }), "string")
    this.assert.equal(typeObject({ default: "123" }), "string")

    this.assert.equal(typeObject({ type: Number, default: 0 }), "number")
    this.assert.equal(typeObject({ type: Number, default: 1 }), "number")
    this.assert.equal(typeObject({ type: Number, default: -1 }), "number")
    this.assert.equal(typeObject({ type: Number }), "number")
    this.assert.equal(typeObject({ default: 0 }), "number")
    this.assert.equal(typeObject({ default: 1 }), "number")
    this.assert.equal(typeObject({ default: -1 }), "number")

    this.assert.equal(typeObject({ type: Array, default: [] }), "array")
    this.assert.equal(typeObject({ type: Array, default: [1] }), "array")
    this.assert.equal(typeObject({ type: Array }), "array")
    this.assert.equal(typeObject({ default: [] }), "array")
    this.assert.equal(typeObject({ default: [1] }), "array")

    this.assert.equal(typeObject({ type: Object, default: {} }), "object")
    this.assert.equal(typeObject({ type: Object, default: { some: "key" } }), "object")
    this.assert.equal(typeObject({ type: Object }), "object")
    this.assert.equal(typeObject({ default: {} }), "object")
    this.assert.equal(typeObject({ default: { some: "key" } }), "object")

    this.assert.equal(typeObject({ type: Boolean, default: true }), "boolean")
    this.assert.equal(typeObject({ type: Boolean, default: false }), "boolean")
    this.assert.equal(typeObject({ type: Boolean }), "boolean")
    this.assert.equal(typeObject({ default: false }), "boolean")

    this.assert.throws(() => typeObject({ type: Boolean, default: "something else" }), {
      name: "Error",
      message: `The specified default value for the Stimulus Value "test.url" must match the defined type "boolean". The provided default value of "something else" is of type "string".`,
    })

    this.assert.throws(() => typeObject({ type: Boolean, default: "true" }), {
      name: "Error",
      message: `The specified default value for the Stimulus Value "test.url" must match the defined type "boolean". The provided default value of "true" is of type "string".`,
    })
  }

  "test parseValueTypeDefinition booleans"() {
    const typeDefinition = (definition: any) => {
      return parseValueTypeDefinition({
        controller: this.controller.identifier,
        token: "url",
        typeDefinition: definition,
      })
    }

    this.assert.equal(typeDefinition(Boolean), "boolean")
    this.assert.equal(typeDefinition(true), "boolean")
    this.assert.equal(typeDefinition(false), "boolean")
    this.assert.equal(typeDefinition({ type: Boolean, default: false }), "boolean")
    this.assert.equal(typeDefinition({ type: Boolean }), "boolean")
    this.assert.equal(typeDefinition({ default: true }), "boolean")

    // since the provided value is actually an object, it's going to be of type "object"
    this.assert.equal(typeDefinition({ default: null }), "object")
    this.assert.equal(typeDefinition({ default: undefined }), "object")

    this.assert.equal(typeDefinition({}), "object")
    this.assert.equal(typeDefinition(""), "string")
    this.assert.equal(typeDefinition([]), "array")

    this.assert.throws(() => typeDefinition(null))
    this.assert.throws(() => typeDefinition(undefined))
  }

  "test defaultValueForDefinition"() {
    this.assert.deepEqual(defaultValueForDefinition(String), "")
    this.assert.deepEqual(defaultValueForDefinition(Boolean), false)
    this.assert.deepEqual(defaultValueForDefinition(Object), {})
    this.assert.deepEqual(defaultValueForDefinition(Array), [])
    this.assert.deepEqual(defaultValueForDefinition(Number), 0)

    this.assert.deepEqual(defaultValueForDefinition({ type: String }), "")
    this.assert.deepEqual(defaultValueForDefinition({ type: Boolean }), false)
    this.assert.deepEqual(defaultValueForDefinition({ type: Object }), {})
    this.assert.deepEqual(defaultValueForDefinition({ type: Array }), [])
    this.assert.deepEqual(defaultValueForDefinition({ type: Number }), 0)

    this.assert.deepEqual(defaultValueForDefinition({ type: String, default: null }), null)
    this.assert.deepEqual(defaultValueForDefinition({ type: Boolean, default: null }), null)
    this.assert.deepEqual(defaultValueForDefinition({ type: Object, default: null }), null)
    this.assert.deepEqual(defaultValueForDefinition({ type: Array, default: null }), null)
    this.assert.deepEqual(defaultValueForDefinition({ type: Number, default: null }), null)

    this.assert.deepEqual(defaultValueForDefinition({ type: String, default: "some string" }), "some string")
    this.assert.deepEqual(defaultValueForDefinition({ type: Boolean, default: true }), true)
    this.assert.deepEqual(defaultValueForDefinition({ type: Object, default: { some: "key" } }), { some: "key" })
    this.assert.deepEqual(defaultValueForDefinition({ type: Array, default: [1, 2, 3] }), [1, 2, 3])
    this.assert.deepEqual(defaultValueForDefinition({ type: Number, default: 99 }), 99)

    this.assert.deepEqual(defaultValueForDefinition("some string"), "some string")
    this.assert.deepEqual(defaultValueForDefinition(true), true)
    this.assert.deepEqual(defaultValueForDefinition({ some: "key" }), { some: "key" })
    this.assert.deepEqual(defaultValueForDefinition([1, 2, 3]), [1, 2, 3])
    this.assert.deepEqual(defaultValueForDefinition(99), 99)

    this.assert.deepEqual(defaultValueForDefinition({ default: "some string" }), "some string")
    this.assert.deepEqual(defaultValueForDefinition({ default: true }), true)
    this.assert.deepEqual(defaultValueForDefinition({ default: { some: "key" } }), { some: "key" })
    this.assert.deepEqual(defaultValueForDefinition({ default: [1, 2, 3] }), [1, 2, 3])
    this.assert.deepEqual(defaultValueForDefinition({ default: 99 }), 99)

    this.assert.deepEqual(defaultValueForDefinition({ default: null }), null)
    this.assert.deepEqual(defaultValueForDefinition({ default: undefined }), undefined)
  }
}
