import { ControllerTestCase } from "../cases/controller_test_case"
import { ValueController } from "../controllers/value_controller"

export default class ValueTests extends ControllerTestCase(ValueController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-shadowed-boolean="true"
      data-${this.identifier}-numeric="123"
      data-${this.identifier}-string="ok"
      data-${this.identifier}-explicit-string="$#!%"
      data-${this.identifier}-floating-point="0.456">
    </div>
  `

  "test values are strings by default"() {
    this.assert.deepEqual(this.controller.stringValue, "ok")

    this.controller.stringValue = "cool"
    this.assert.deepEqual(this.controller.stringValue, "cool")
    this.assert.deepEqual(this.get("string"), "cool")

    this.assert.deepEqual(this.controller.explicitStringValue, "$#!%")
  }

  "test integer values"() {
    this.assert.deepEqual(this.controller.numericValue, 123)

    this.controller.numericValue = 456
    this.assert.deepEqual(this.controller.numericValue, 456)
    this.assert.deepEqual(this.get("numeric"), "456")

    this.controller.numericValue = "789" as any
    this.assert.deepEqual(this.controller.numericValue, 789)

    this.controller.numericValue = 7.89
    this.assert.deepEqual(this.controller.numericValue, 7)

    this.controller.numericValue = "garbage" as any
    this.assert.ok(isNaN(this.controller.numericValue))
    this.assert.equal(this.get("numeric"), "garbage")
  }

  "test floating-point values"() {
    this.assert.deepEqual(this.controller.floatingPointValue, 0.456)

    this.controller.floatingPointValue = 1.23
    this.assert.deepEqual(this.controller.floatingPointValue, 1.23)
    this.assert.deepEqual(this.get("floating-point"), "1.23")

    this.controller.floatingPointValue = Infinity
    this.assert.deepEqual(this.controller.floatingPointValue, Infinity)
    this.assert.deepEqual(this.get("floating-point"), "Infinity")

    this.controller.floatingPointValue = "garbage" as any
    this.assert.ok(isNaN(this.controller.floatingPointValue))
    this.assert.equal(this.get("floating-point"), "garbage")
  }

  "test boolean values"() {
    this.assert.deepEqual(this.controller.shadowedBooleanValue, true)

    this.controller.shadowedBooleanValue = false
    this.assert.deepEqual(this.controller.shadowedBooleanValue, false)
    this.assert.deepEqual(this.get("shadowed-boolean"), "false")

    this.controller.shadowedBooleanValue = "" as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, true)
    this.assert.deepEqual(this.get("shadowed-boolean"), "")

    this.controller.shadowedBooleanValue = 0 as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, false)
    this.assert.deepEqual(this.get("shadowed-boolean"), "0")

    this.controller.shadowedBooleanValue = 1 as any
    this.assert.deepEqual(this.controller.shadowedBooleanValue, true)
    this.assert.deepEqual(this.get("shadowed-boolean"), "1")
  }

  "test accessing a value throws when the attribute is not present"() {
    this.controller.stringValue = undefined as any
    this.assert.notOk(this.has("string"))
    this.assert.raises(() => this.controller.stringValue)
  }

  "test accessing a value returns its default when the attribute is not present"() {
    this.assert.deepEqual(this.controller.stringWithDefaultValue, "hello")
    this.assert.notOk(this.has("string-with-default"))

    this.controller.stringWithDefaultValue = "goodbye"
    this.assert.deepEqual(this.controller.stringWithDefaultValue, "goodbye")
    this.assert.deepEqual(this.get("string-with-default"), "goodbye")

    this.controller.stringWithDefaultValue = undefined as any
    this.assert.deepEqual(this.controller.stringWithDefaultValue, "hello")
    this.assert.notOk(this.has("string-with-default"))
  }

  async "test change notifications"() {
    this.assert.deepEqual(this.controller.loggedNumericValues, [123])

    this.controller.numericValue = 0
    await this.nextFrame
    this.assert.deepEqual(this.controller.loggedNumericValues, [123, 0])

    this.set("numeric", "1")
    await this.nextFrame
    this.assert.deepEqual(this.controller.loggedNumericValues, [123, 0, 1])
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

