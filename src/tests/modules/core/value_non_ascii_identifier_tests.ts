import { ControllerTestCase } from "../../cases/controller_test_case"
import { ValueController } from "../../controllers/value_controller"

export default class ValueNonAsciiIdentifierTests extends ControllerTestCase(ValueController) {
  identifier = "Élément"
  fixtureHTML = `
    <div data-controller="${this.identifier}" data-${this.identifier}-numeric-value="123"></div>
  `

  async "test values and changed callbacks with a non-ASCII identifier"() {
    this.assert.equal(this.controller.numericValue, 123)
    this.assert.deepEqual(this.controller.loggedNumericValues, [123])

    this.controller.numericValue = 0
    await this.nextFrame
    this.assert.equal(this.controller.element.getAttribute(`data-${this.identifier}-numeric-value`), "0")
    this.assert.deepEqual(this.controller.loggedNumericValues, [123, 0])

    await this.setAttribute(this.controller.element, `data-${this.identifier}-numeric-value`, "1")
    this.assert.equal(this.controller.numericValue, 1)
    this.assert.deepEqual(this.controller.loggedNumericValues, [123, 0, 1])
  }
}
