import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class LifecycleTests extends LogControllerTestCase {
  controllerElement!: Element

  async setup() {
    this.controllerElement = this.controller.element
  }

  async "test Controller#initialize"() {
    const controller = this.controller
    this.assert.equal(controller.initializeCount, 1)
    await this.reconnectControllerElement()
    this.assert.equal(this.controller, controller)
    this.assert.equal(controller.initializeCount, 1)
  }

  async "test Controller#connect"() {
    this.assert.equal(this.controller.connectCount, 1)
    await this.reconnectControllerElement()
    this.assert.equal(this.controller.connectCount, 2)
  }

  async "test Controller#disconnect"() {
    const controller = this.controller
    this.assert.equal(controller.disconnectCount, 0)
    await this.disconnectControllerElement()
    this.assert.equal(controller.disconnectCount, 1)
  }

  async "test Controller#attributeChanged called when element changes an attribute"() {
    const controller = this.controller

    this.assert.equal(controller.attributeChangedCount, 0)

    await this.setElementAttribute(this.controller.element, "data-changed", "new-value")

    const lastMutation = controller.mutationLog.pop()
    this.assert.equal(controller.attributeChangedCount, 1)
    this.assert.equal(lastMutation?.attributeName, "data-changed")
    this.assert.equal(lastMutation?.oldValue, null)
    this.assert.equal(lastMutation?.newValue, "new-value")
  }

  async "test Controller#attributeChanged not called when descendant changes an attribute"() {
    const controller = this.controller
    this.controllerElement.insertAdjacentHTML("beforeend", `<div id="child"></div>`)
    const element = controller.element.querySelector("#child")

    this.assert.equal(controller.attributeChangedCount, 0)

    await this.setElementAttribute(element!, "data-changed", "new-value")

    this.assert.equal(controller.attributeChangedCount, 0)
    this.assert.equal(controller.mutationLog.length, 0)
  }

  async setElementAttribute(element: Element, attributeName: string, value: string) {
    element.setAttribute(attributeName, value)
    await this.nextFrame
  }

  async reconnectControllerElement() {
    await this.disconnectControllerElement()
    await this.connectControllerElement()
  }

  async connectControllerElement() {
    this.fixtureElement.appendChild(this.controllerElement)
    await this.nextFrame
  }

  async disconnectControllerElement() {
    this.fixtureElement.removeChild(this.controllerElement)
    await this.nextFrame
  }
}
