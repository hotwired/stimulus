import { ControllerTestCase } from "../../cases/controller_test_case"
import { ClassController } from "../../controllers/class_controller"

export default class ClassTests extends ControllerTestCase(ClassController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-active-class="test--active"
      data-${this.identifier}-loading-class="busy"
      data-${this.identifier}-success-class="bg-green-400 border border-green-600"
      data-loading-class="xxx"
    ></div>
  `

  "test accessing a class property"() {
    this.assert.ok(this.controller.hasActiveClass)
    this.assert.equal(this.controller.activeClass, "test--active")
    this.assert.deepEqual(this.controller.activeClasses, ["test--active"])
  }

  "test accessing a missing class property throws an error"() {
    this.assert.notOk(this.controller.hasEnabledClass)
    this.assert.raises(() => this.controller.enabledClass)
    this.assert.equal(this.controller.enabledClasses.length, 0)
  }

  "test classes must be scoped by identifier"() {
    this.assert.equal(this.controller.loadingClass, "busy")
  }

  "test multiple classes map to array"() {
    this.assert.deepEqual(this.controller.successClasses, ["bg-green-400", "border", "border-green-600"])
  }

  "test accessing a class property returns first class if multiple classes are used"() {
    this.assert.equal(this.controller.successClass, "bg-green-400");
  }
}
