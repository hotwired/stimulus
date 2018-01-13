import { LogControllerTestCase } from "../log_controller_test_case"

export default class ActionTests extends LogControllerTestCase {
  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <button data-action="${this.identifier}#log">
        <span>Log</span>
      </button>
    </div>
  `

  async "test default event for <button>"() {
    await this.triggerEvent("button", "click")
    this.assertActions({ name: "log", eventType: "click" })
  }

  async "test bubbling"() {
    await this.triggerEvent("span", "click")
    this.assertActions({ eventType: "click", eventTarget: this.findElement("button") })
  }

  "test nested actions"() {
    this.assert.expect(0)
  }

  "test multiple actions"() {
    this.assert.expect(0)
  }

  "test global actions"() {
    this.assert.expect(0)
  }

  "test actions ignore events triggered in child scopes"() {
    this.assert.expect(0)
  }

  "test actions can observe non-bubbling events"() {
    this.assert.expect(0)
  }

  "test global actions can observe events from elements outside the scope"() {
    this.assert.expect(0)
  }
}
