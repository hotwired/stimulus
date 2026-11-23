import { ControllerTestCase } from "../../cases/controller_test_case"
import { ValueController } from "../../controllers/value_controller"

export default class ValueSvgElementTests extends ControllerTestCase(ValueController) {
  identifier = "CamelCase"
  fixtureHTML = `<svg data-controller="${this.identifier}"></svg>`

  async "test values and changed callbacks on an SVG element with a mixed-case attribute set from JavaScript"() {
    this.assert.deepEqual(this.controller.loggedNumericValues, [0])

    await this.setAttribute(this.controller.element, `data-${this.identifier}-numeric-value`, "5")
    this.assert.equal(this.controller.numericValue, 5)
    this.assert.deepEqual(this.controller.loggedNumericValues, [0, 5])

    this.controller.numericValue = 7
    await this.nextFrame
    this.assert.equal(this.controller.element.getAttribute(`data-${this.identifier}-numeric-value`), "7")
    this.assert.deepEqual(this.controller.loggedNumericValues, [0, 5, 7])
  }
}
