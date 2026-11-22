import { ClassController } from "../../controllers/class_controller"
import { ControllerTestCase } from "../../cases/controller_test_case"

export default class FindElementTests extends ControllerTestCase(ClassController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-active-class="active"
      data-${this.identifier}-loading-class="busy"
    >
      <div id="inside" class="busy"></div>
    </div>
    <div id="outside" class="busy"></div>

    "test findElement finds element by id inside scope"() {
      const result = this.controller.findElement("inside")
      this.assert.equal(result?.id, "inside")
    }

    "test findElement does not find element by id outside scope"() {
      const result = this.controller.findElement("outside")
      this.assert.equal(result, undefined)
    }

    "test findElement finds element by defined class"() {
      const result = this.controller.findElement(this.controller.loadingClass)
      this.assert.ok(result instanceof Element)
      this.assert.ok(result?.classList.contains("busy"))
    }

    "test findAllElements returns multiple matches for defined class"() {
      const results = this.controller.findAllElements(this.controller.loadingClass)
      this.assert.ok(Array.isArray(results))
      this.assert.equal(results.length, 1)
      this.assert.ok(results[0].classList.contains("busy"))
    }
  `
}
