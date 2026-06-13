import { ControllerTestCase } from "../../cases/controller_test_case"
import { AriaController } from "../../controllers/aria_controller"
import { capitalize } from "../../../core/string_helpers"

export default class AriaTests extends ControllerTestCase(AriaController) {
  identifier = ["aria"]
  fixtureHTML = `
    <div id="controller"></div>
    <div id="a"></div>
    <div id="b"></div>
  `

  async "test defines dynamic Element properties"() {
    const propertyNames = [
      "ariaActiveDescendant",
      "ariaDetails",
      "ariaErrorMessage",
      "ariaControls",
      "ariaDescribedBy",
      "ariaFlowTo",
      "ariaLabelledBy",
      "ariaOwns",
    ]
    const controllerElement = this.findElement("#controller")
    await this.setAttribute(controllerElement, "data-controller", "aria")

    for (const property of propertyNames) {
      this.assert.ok(
        `has${capitalize(property)}Element` in this.controller,
        `expected controller to define has${capitalize(property)}Element`
      )
      this.assert.ok(`${property}Element` in this.controller, `expected controller to define ${property}Element`)
      this.assert.ok(`${property}Elements` in this.controller, `expected controller to define ${property}Elements`)
    }
  }

  async "test invokes ariaControlsElementConnected when setting [aria-controls] attribute"() {
    const controllerElement = this.findElement("#controller")
    const element = this.findElement("#a")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "a")

    this.assert.deepEqual(this.controller.added.getValuesForKey("aria-controls"), [element])
  }

  async "test invokes ariaControlsElementDisconnected when removing [aria-controls] attribute"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "a")
    await this.removeAttribute(controllerElement, "aria-controls")

    this.assert.deepEqual(this.controller.removed.getValuesForKey("aria-controls"), [this.findElement("#a")])
  }

  async "test invokes ariaControlsElementConnected when the controller connects"() {
    const controllerElement = this.findElement("#controller")
    const element = this.findElement("#a")

    await this.setAttribute(controllerElement, "aria-controls", "a")
    await this.setAttribute(controllerElement, "data-controller", "aria")

    this.assert.deepEqual(this.controller.added.getValuesForKey("aria-controls"), [element])
  }

  async "test invokes ariaControlsElementDisconnected when the controller disconnects"() {
    const controllerElement = this.findElement("#controller")
    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "a")

    const removed = this.controller.removed
    await this.removeAttribute(controllerElement, "data-controller")

    this.assert.deepEqual(removed.getValuesForKey("aria-controls"), [this.findElement("#a")])
  }

  async "test hasAriaControlsElement returns true when there is an element"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "a")

    this.assert.ok((this.controller as any)["hasAriaControlsElement"])
  }

  async "test hasAriaControlsElement returns false when there isn't an element"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")

    this.assert.notOk((this.controller as any)["hasAriaControlsElement"])
  }

  async "test ariaControlsElement returns the first element"() {
    const controllerElement = this.findElement("#controller")
    const element = this.findElement("#a")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "a")

    this.assert.equal((this.controller as any)["ariaControlsElement"], element)
  }

  async "test ariaControlsElements returns the list of elements"() {
    const controllerElement = this.findElement("#controller")
    const a = this.findElement("#a")
    const b = this.findElement("#b")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "b c a")

    this.assert.deepEqual((this.controller as any)["ariaControlsElements"], [b, a])
  }

  async "test invokes ariaControlsElementConnected when an element referenced by [aria-controls] connects"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "c")

    this.fixtureElement.insertAdjacentHTML("beforeend", `<div id="c"></div>`)
    await this.nextFrame

    this.assert.deepEqual(this.controller.added.getValuesForKey("aria-controls"), [this.findElement("#c")])
  }

  async "test invokes ariaControlsElementDisconnected when an element referenced by [aria-controls] disconnects"() {
    const controllerElement = this.findElement("#controller")
    const c = Object.assign(document.createElement("div"), { id: "c" })

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "c")
    this.fixtureElement.append(c)
    await this.nextFrame
    await this.remove(c)

    this.assert.deepEqual(this.controller.removed.getValuesForKey("aria-controls"), [c])
  }

  async "test invokes ariaControlsElementConnected when adding [aria-controls] token"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "a b")

    this.assert.deepEqual(this.controller.added.getValuesForKey("aria-controls"), [
      this.findElement("#a"),
      this.findElement("#b"),
    ])
  }

  async "test invokes ariaDescribedByElementConnected when adding [aria-describedby] token"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-describedby", "a b")

    this.assert.deepEqual(this.controller.added.getValuesForKey("aria-describedby"), [
      this.findElement("#a"),
      this.findElement("#b"),
    ])
  }

  async "test invokes ariaControlsElementDisconnected when removing [aria-controls] token"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-controls", "b a")
    await this.setAttribute(controllerElement, "aria-controls", "b")

    this.assert.deepEqual(this.controller.removed.getValuesForKey("aria-controls"), [this.findElement("#a")])
  }

  async "test invokes ariaDescribedByElementDisconnected when removing [aria-describedby] token"() {
    const controllerElement = this.findElement("#controller")

    await this.setAttribute(controllerElement, "data-controller", "aria")
    await this.setAttribute(controllerElement, "aria-describedby", "b a")
    await this.setAttribute(controllerElement, "aria-describedby", "b")

    this.assert.deepEqual(this.controller.removed.getValuesForKey("aria-describedby"), [this.findElement("#a")])
  }

  async "test does not loop infinitely when a callback writes to the attribute"() {
    const controllerElement = this.findElement("#controller")
    const a = this.findElement("#a")
    const b = this.findElement("#b")

    this.setAttribute(controllerElement, "data-controller", "aria")
    this.setAttribute(controllerElement, "aria-owns", "a")
    await this.nextFrame

    this.assert.equal(controllerElement.getAttribute("aria-owns"), "controller a b")
    this.assert.deepEqual(this.controller.added.getValuesForKey("aria-owns"), [a, b, controllerElement])
  }
}
