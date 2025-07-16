import { ClassController } from "../../controllers/class_controller"
import { ControllerTestCase } from "../../cases/controller_test_case"

export default class FindElementTests extends ControllerTestCase(ClassController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}"
      data-${this.identifier}-active-class="test--active"
      data-${this.identifier}-loading-class="busy"
      data-${this.identifier}-success-class="bg-green-400 border border-green-600"
    >
      <div id="inside-id" class="busy"></div>
    </div>
    <div id="outside-id" class="busy"></div>

    "test findElement finds element by id inside scope"() {
      const result = this.controller.findElement("inside-id")
      this.assert.equal(result?.id, "inside-id")
    }

    "test findElement does not find element by id outside scope"() {
      const result = this.controller.findElement("outside-id")
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
