import { ControllerTestCase } from "../../cases/controller_test_case"
import { DefaultValueController } from "../../controllers/default_value_controller"

export default class DefaultValueTests extends ControllerTestCase(DefaultValueController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-default-string-override-value="I am the expected value"
      data-${this.identifier}-default-boolean-override-value="false"
      data-${this.identifier}-default-number-override-value="42"
      data-${this.identifier}-default-array-override-value="[9,8,7]"
      data-${this.identifier}-default-object-override-value='{"expected":"value"}'
    </div>
  `

  // Booleans

  "test custom default boolean values"() {
    this.assert.deepEqual(this.controller.defaultBooleanValue, false)
    this.assert.ok(this.controller.hasDefaultBooleanValue)
    this.assert.deepEqual(this.get("default-boolean-value"), null)

    this.assert.deepEqual(this.controller.defaultBooleanTrueValue, true)
    this.assert.ok(this.controller.hasDefaultBooleanTrueValue)
    this.assert.deepEqual(this.get("default-boolean-true-value"), null)

    this.assert.deepEqual(this.controller.defaultBooleanFalseValue, false)
    this.assert.ok(this.controller.hasDefaultBooleanFalseValue)
    this.assert.deepEqual(this.get("default-boolean-false-value"), null)
  }

  "test should be able to set a new value for custom default boolean values"() {
    this.assert.deepEqual(this.get("default-boolean-true-value"), null)
    this.assert.deepEqual(this.controller.defaultBooleanTrueValue, true)
    this.assert.ok(this.controller.hasDefaultBooleanTrueValue)

    this.controller.defaultBooleanTrueValue = false

    this.assert.deepEqual(this.get("default-boolean-true-value"), "false")
    this.assert.deepEqual(this.controller.defaultBooleanTrueValue, false)
    this.assert.ok(this.controller.hasDefaultBooleanTrueValue)
  }

  "test should override custom default boolean value with given data-attribute"() {
    this.assert.deepEqual(this.get("default-boolean-override-value"), "false")
    this.assert.deepEqual(this.controller.defaultBooleanOverrideValue, false)
    this.assert.ok(this.controller.hasDefaultBooleanOverrideValue)
  }

  // Strings

  "test custom default string values"() {
    this.assert.deepEqual(this.controller.defaultStringValue, "")
    this.assert.ok(this.controller.hasDefaultStringValue)
    this.assert.deepEqual(this.get("default-string-value"), null)

    this.assert.deepEqual(this.controller.defaultStringHelloValue, "Hello")
    this.assert.ok(this.controller.hasDefaultStringHelloValue)
    this.assert.deepEqual(this.get("default-string-hello-value"), null)

  }

  "test should be able to set a new value for custom default string values"() {
    this.assert.deepEqual(this.get("default-string-value"), null)
    this.assert.deepEqual(this.controller.defaultStringValue, "")
    this.assert.ok(this.controller.hasDefaultStringValue)

    this.controller.defaultStringValue = "New Value"

    this.assert.deepEqual(this.get("default-string-value"), "New Value")
    this.assert.deepEqual(this.controller.defaultStringValue, "New Value")
    this.assert.ok(this.controller.hasDefaultStringValue)
  }

  "test should override custom default string value with given data-attribute"() {
    this.assert.deepEqual(this.get("default-string-override-value"), "I am the expected value")
    this.assert.deepEqual(this.controller.defaultStringOverrideValue, "I am the expected value")
    this.assert.ok(this.controller.hasDefaultStringOverrideValue)
  }

  // Numbers

  "test custom default number values"() {
    this.assert.deepEqual(this.controller.defaultNumberValue, 0)
    this.assert.ok(this.controller.hasDefaultNumberValue)
    this.assert.deepEqual(this.get("default-number-value"), null)

    this.assert.deepEqual(this.controller.defaultNumberThousandValue, 1000)
    this.assert.ok(this.controller.hasDefaultNumberThousandValue)
    this.assert.deepEqual(this.get("default-number-thousand-value"), null)

    this.assert.deepEqual(this.controller.defaultNumberZeroValue, 0)
    this.assert.ok(this.controller.hasDefaultNumberZeroValue)
    this.assert.deepEqual(this.get("default-number-zero-value"), null)
  }

  "test should be able to set a new value for custom default number values"() {
    this.assert.deepEqual(this.get("default-number-value"), null)
    this.assert.deepEqual(this.controller.defaultNumberValue, 0)
    this.assert.ok(this.controller.hasDefaultNumberValue)

    this.controller.defaultNumberValue = 123

    this.assert.deepEqual(this.get("default-number-value"), "123")
    this.assert.deepEqual(this.controller.defaultNumberValue, 123)
    this.assert.ok(this.controller.hasDefaultNumberValue)
  }

  "test should override custom default number value with given data-attribute"() {
    this.assert.deepEqual(this.get("default-number-override-value"), "42")
    this.assert.deepEqual(this.controller.defaultNumberOverrideValue, 42)
    this.assert.ok(this.controller.hasDefaultNumberOverrideValue)
  }

  // Arrays

  "test custom default array values"() {
    this.assert.deepEqual(this.controller.defaultArrayValue, [])
    this.assert.ok(this.controller.hasDefaultArrayValue)
    this.assert.deepEqual(this.get("default-array-value"), null)

    this.assert.deepEqual(this.controller.defaultArrayFilledValue, [1, 2, 3])
    this.assert.ok(this.controller.hasDefaultArrayFilledValue)
    this.assert.deepEqual(this.get("default-array-filled-value"), null)
  }

  "test should be able to set a new value for custom default array values"() {
    this.assert.deepEqual(this.get("default-array-value"), null)
    this.assert.deepEqual(this.controller.defaultArrayValue, [])
    this.assert.ok(this.controller.hasDefaultArrayValue)

    this.controller.defaultArrayValue = [1, 2]

    this.assert.deepEqual(this.get("default-array-value"), "[1,2]")
    this.assert.deepEqual(this.controller.defaultArrayValue, [1, 2])
    this.assert.ok(this.controller.hasDefaultArrayValue)
  }

  "test should override custom default array value with given data-attribute"() {
    this.assert.deepEqual(this.get("default-array-override-value"), "[9,8,7]")
    this.assert.deepEqual(this.controller.defaultArrayOverrideValue, [9, 8, 7])
    this.assert.ok(this.controller.hasDefaultArrayOverrideValue)
  }

  // Objects

  "test custom default object values"() {
    this.assert.deepEqual(this.controller.defaultObjectValue, {})
    this.assert.ok(this.controller.hasDefaultObjectValue)
    this.assert.deepEqual(this.get("default-object-value"), null)

    this.assert.deepEqual(this.controller.defaultObjectPersonValue, { name: "David" })
    this.assert.ok(this.controller.hasDefaultObjectPersonValue)
    this.assert.deepEqual(this.get("default-object-filled-value"), null)
  }

  "test should be able to set a new value for custom default object values"() {
    this.assert.deepEqual(this.get("default-object-value"), null)
    this.assert.deepEqual(this.controller.defaultObjectValue, {})
    this.assert.ok(this.controller.hasDefaultObjectValue)

    this.controller.defaultObjectValue = { new: "value" }

    this.assert.deepEqual(this.get("default-object-value"), "{\"new\":\"value\"}")
    this.assert.deepEqual(this.controller.defaultObjectValue, { new: "value" })
    this.assert.ok(this.controller.hasDefaultObjectValue)
  }

  "test should override custom default object value with given data-attribute"() {
    this.assert.deepEqual(this.get("default-object-override-value"), "{\"expected\":\"value\"}")
    this.assert.deepEqual(this.controller.defaultObjectOverrideValue, { expected: "value" })
    this.assert.ok(this.controller.hasDefaultObjectOverrideValue)
  }

  "test [name]ValueChanged callbacks fire after initialize and before connect"() {
    this.assert.deepEqual(this.controller.lifecycleCallbacks, ["initialize", "defaultBooleanValueChanged", "connect"])
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
