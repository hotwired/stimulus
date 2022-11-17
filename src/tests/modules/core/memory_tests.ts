import { ControllerTestCase } from "../../cases/controller_test_case"

export default class MemoryTests extends ControllerTestCase() {
  controllerElement!: Element

  async setup() {
    this.controllerElement = this.controller.element
  }

  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <button data-action="${this.identifier}#doLog">Log</button>
      <button data-action="${this.identifier}#doAlert">Alert</button>
    </div>
  `

  async "test removing a controller clears dangling eventListeners"() {
    this.assert.equal(this.application.dispatcher.eventListeners.length, 2)
    await this.fixtureElement.removeChild(this.controllerElement)
    this.assert.equal(this.application.dispatcher.eventListeners.length, 0)
  }
}
