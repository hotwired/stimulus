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
