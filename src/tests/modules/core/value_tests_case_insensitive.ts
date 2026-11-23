import ValueTests from "./value_tests"

export default class ValueCaseInsensitiveTests extends ValueTests {
  identifier = "Test"

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

    this.controller.optionsValue = { person: { name: "John", age: 42, active: true } }
    await this.nextFrame
    this.assert.deepEqual(this.controller.optionsValues, [
      { one: [2, 3] },
      { person: { name: "John", age: 42, active: true } },
    ])
    this.assert.deepEqual(this.controller.oldOptionsValues, [{}, { one: [2, 3] }])

    this.set("options-value", "{}")
    await this.nextFrame
    this.assert.deepEqual(this.controller.optionsValues, [
      { one: [2, 3] },
      { person: { name: "John", age: 42, active: true } },
      {},
    ])
    this.assert.deepEqual(this.controller.oldOptionsValues, [
      {},
      { one: [2, 3] },
      { person: { name: "John", age: 42, active: true } },
    ])
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
