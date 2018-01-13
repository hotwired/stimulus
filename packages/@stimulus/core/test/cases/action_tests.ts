import { LogControllerTestCase } from "../log_controller_test_case"

export default class ActionTests extends LogControllerTestCase {
  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <button data-action="${this.identifier}#log">Log</button>
    </div>
  `

  async "test a <button>'s default event"() {
    await this.triggerEvent("button", "click")
    this.assertActions(
      { name: "log", eventType: "click" }
    )
  }
}
