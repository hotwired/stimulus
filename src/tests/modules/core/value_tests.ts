import { ControllerTestCase } from "../../cases/controller_test_case"
import { ValueController } from "../../controllers/value_controller"

export default class ValueTests extends ControllerTestCase(ValueController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-shadowed-boolean-value="true"
      data-${this.identifier}-numeric-value="123"
      data-${this.identifier}-string-value="ok"
      data-${this.identifier}-ids-value="[1,2,3]"
      data-${this.identifier}-options-value='{"one":[2,3]}'
      data-${this.identifier}-time-24hr-value="true">
    </div>
  `

  "test string values"() {
    this.assert.deepEqual(this.controller.stringValue, "ok")

    this.controller.stringValue = "cool"
    this.assert.deepEqual(this.controller.stringValue, "cool")
    this.assert.deepEqual(this.get("string-value"), "cool")
  }

  "test numeric values"() {
    this.assert.deepEqual(this.controller.numericValue, 123)

    this.controller.numericValue = 456
    this.assert.deepEqual(this.controller.numericValue, 456)
    this.assert.deepEqual(this.get("numeric-value"), "456")

    this.controller.numericValue = "789" as any
    this.assert.deepEqual(this.controller.numericValue, 789)

    this.controller.numericValue = 1.23
    this.assert.deepEqual(this.controller.numericValue, 1.23)
    this.assert.deepEqual(this.get("numeric-value"), "1.23")

    this.controller.numericValue = Infinity
    this.assert.deepEqual(this.controller.numericValue, Infinity)
    this.assert.deepEqual(this.get("numeric-value"), "Infinity")

    this.controller.numericValue = "garbage" as any
    this.assert.ok(isNaN(this.controller.numericValue))
    this.assert.equal(this.get("numeric-value"), "garbage")

    this.controller.numericValue = "" as any
    this.assert.equal(this.controller.numericValue, 0)
    this.assert.equal(this.get("numeric-value"), "")
  }

  "test boolean values"() {
    this.assert.deepEqual(this.controller.shadowedBooleanValue, true)

    this.controller.shadowedBooleanValue = false
    this.assert.deepEqual(this.controller.shadowedBooleanValue, false)
    this.assert.deepEqual(this.get("shadowed-boolean-value"), "false")

    this.controller.shadowedBooleanValue = "" as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, true)
    this.assert.deepEqual(this.get("shadowed-boolean-value"), "")

    this.controller.shadowedBooleanValue = 0 as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, false)
    this.assert.deepEqual(this.get("shadowed-boolean-value"), "0")

    this.controller.shadowedBooleanValue = 1 as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, true)
    this.assert.deepEqual(this.get("shadowed-boolean-value"), "1")

    this.controller.shadowedBooleanValue = "False" as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, false)
    this.assert.deepEqual(this.get("shadowed-boolean-value"), "False")
  }

  "test array values"() {
    this.assert.deepEqual(this.controller.idsValue, [1, 2, 3])

    this.controller.idsValue.push(4)
    this.assert.deepEqual(this.controller.idsValue, [1, 2, 3])

    this.controller.idsValue = []
    this.assert.deepEqual(this.controller.idsValue, [])
    this.assert.deepEqual(this.get("ids-value"), "[]")

    this.controller.idsValue = null as any
    this.assert.throws(() => this.controller.idsValue)

    this.controller.idsValue = {} as any
    this.assert.throws(() => this.controller.idsValue)
  }

  "test object values"() {
    this.assert.deepEqual(this.controller.optionsValue, { "one": [2, 3] })

    this.controller.optionsValue["one"] = 0
    this.assert.deepEqual(this.controller.optionsValue, { "one": [2, 3] })

    this.controller.optionsValue = {}
    this.assert.deepEqual(this.controller.optionsValue, {})
    this.assert.deepEqual(this.get("options-value"), "{}")

    this.controller.optionsValue = null as any
    this.assert.throws(() => this.controller.optionsValue)

    this.controller.optionsValue = [] as any
    this.assert.throws(() => this.controller.optionsValue)
  }

  "test accessing a string value returns the empty string when the attribute is missing"() {
    this.controller.stringValue = undefined as any
    this.assert.notOk(this.has("string-value"))
    this.assert.deepEqual(this.controller.stringValue, "")
  }

  "test accessing a numeric value returns zero when the attribute is missing"() {
    this.controller.numericValue = undefined as any
    this.assert.notOk(this.has("numeric-value"))
    this.assert.deepEqual(this.controller.numericValue, 0)
  }

  "test accessing a boolean value returns false when the attribute is missing"() {
    this.controller.shadowedBooleanValue = undefined as any
    this.assert.notOk(this.has("shadowed-boolean-value"))
    this.assert.deepEqual(this.controller.shadowedBooleanValue, false)
  }

  "test accessing an array value returns an empty array when the attribute is missing"() {
    this.controller.idsValue = undefined as any
    this.assert.notOk(this.has("ids-value"))
    this.assert.deepEqual(this.controller.idsValue, [])

    this.controller.idsValue.push(1)
    this.assert.deepEqual(this.controller.idsValue, [])
  }

  "test accessing an object value returns an empty object when the attribute is missing"() {
    this.controller.optionsValue = undefined as any
    this.assert.notOk(this.has("options-value"))
    this.assert.deepEqual(this.controller.optionsValue, {})

    this.controller.optionsValue.hello = true
    this.assert.deepEqual(this.controller.optionsValue, {})
  }

  async "test changed callbacks"() {
    this.assert.deepEqual(this.controller.loggedNumericValues, [123])
    this.assert.deepEqual(this.controller.oldLoggedNumericValues, [0])

    this.controller.numericValue = 0
    await this.nextFrame
    this.assert.deepEqual(this.controller.loggedNumericValues, [123, 0])
    this.assert.deepEqual(this.controller.oldLoggedNumericValues, [0, 123])

    this.set("numeric-value", "1")
    await this.nextFrame
    this.assert.deepEqual(this.controller.loggedNumericValues, [123, 0, 1])
    this.assert.deepEqual(this.controller.oldLoggedNumericValues, [0, 123, 0])
  }

  async "test changed callbacks for object"() {
    this.assert.deepEqual(this.controller.optionsValues, [{ one: [2, 3] }])
    this.assert.deepEqual(this.controller.oldOptionsValues, [{}])

    this.controller.optionsValue = { person: { name: 'John', age: 42, active: true } }
    await this.nextFrame
    this.assert.deepEqual(this.controller.optionsValues, [{ one: [2, 3] }, { person: { name: 'John', age: 42, active: true } }])
    this.assert.deepEqual(this.controller.oldOptionsValues, [{}, { one: [2, 3] }])

    this.set("options-value", "{}")
    await this.nextFrame
    this.assert.deepEqual(this.controller.optionsValues, [{ one: [2, 3] }, { person: { name: 'John', age: 42, active: true } }, {}])
    this.assert.deepEqual(this.controller.oldOptionsValues, [{}, { one: [2, 3] }, { person: { name: 'John', age: 42, active: true } }])
  }

  async "test default values trigger changed callbacks"() {
    this.assert.deepEqual(this.controller.loggedMissingStringValues, [""])
    this.assert.deepEqual(this.controller.oldLoggedMissingStringValues, [undefined])

    this.controller.missingStringValue = "hello"
    await this.nextFrame
    this.assert.deepEqual(this.controller.loggedMissingStringValues, ["", "hello"])
    this.assert.deepEqual(this.controller.oldLoggedMissingStringValues, [undefined, ""])

    this.controller.missingStringValue = undefined as any
    await this.nextFrame
    this.assert.deepEqual(this.controller.loggedMissingStringValues, ["", "hello", ""])
    this.assert.deepEqual(this.controller.oldLoggedMissingStringValues, [undefined, "", "hello"])
  }

  "test keys may be specified in kebab-case"() {
    this.assert.equal(this.controller.time24hrValue, true)
  }

  has(name: string) {
    return this.element.hasAttribute(this.attr(name))
  }

  get(name: string) {
    return this.element.getAttribute(this.attr(name))
  }

  set(name: string, value: string) {
    return this.element.setAttribute(this.attr(name), value)
  }

  attr(name: string) {
    return `data-${this.identifier}-${name}`
  }

  get element() {
    return this.controller.element
  }
}
