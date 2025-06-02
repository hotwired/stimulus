import { ControllerTestCase } from "../../cases/controller_test_case"

export default class MemoryTests extends ControllerTestCase() {
  controllerElement!: Element

  async setup() {
    this.controllerElement = this.controller.element
  }

  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <button id="button1" data-action="${this.identifier}#doLog">Log</button>
      <button id="button2" data-action="${this.identifier}#doAlert ${this.identifier}#log2">Alert</button>
    </div>
  `

  async "test removing a controller clears dangling eventListeners"() {
    this.assert.equal(this.application.dispatcher.eventListeners.length, 2)
    await this.fixtureElement.removeChild(this.controllerElement)
    this.assert.equal(this.application.dispatcher.eventListeners.length, 0)
  }

  async "test removing a button clears dangling eventListeners"() {
    this.assert.equal(this.application.dispatcher.eventListeners.length, 2)

    const button = this.findElement("#button1")
    await this.remove(button)

    this.assert.equal(this.application.dispatcher.eventListeners.length, 1)
  }

  async "test removing a button clears dangling eventListeners with multiple actions"() {
    this.assert.equal(this.application.dispatcher.eventListeners.length, 2)

    const button = this.findElement("#button2")
    await this.remove(button)

    this.assert.equal(this.application.dispatcher.eventListeners.length, 1)
  }
}
