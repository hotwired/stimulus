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

  "skip nested actions"() {
  }

  "skip multiple actions"() {
  }

  "skip global actions"() {
  }

  "skip actions ignore events triggered in child scopes"() {
  }

  "skip actions can observe non-bubbling events"() {
  }

  "skip global actions can observe events from elements outside the scope"() {
  }
}
