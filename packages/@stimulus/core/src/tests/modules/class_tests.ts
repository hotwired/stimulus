import { ControllerTestCase } from "../cases/controller_test_case"
import { ClassController } from "../controllers/class_controller"

export default class ValueTests extends ControllerTestCase(ClassController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-active-class="test--active"
      data-${this.identifier}-loading-class="busy"
      data-loading-class="xxx"
    ></div>
  `

  "test accessing a class property"() {
    this.assert.ok(this.controller.hasActiveClass)
    this.assert.equal(this.controller.activeClass, "test--active")
  }

  "test accessing a missing class property throws an error"() {
    this.assert.notOk(this.controller.hasEnabledClass)
    this.assert.raises(() => this.controller.enabledClass)
  }

  "test classes must be scoped by identifier"() {
    this.assert.equal(this.controller.loadingClass, "busy")
  }
}
