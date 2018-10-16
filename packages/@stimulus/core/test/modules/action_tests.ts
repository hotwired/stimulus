import { LogControllerTestCase } from "../cases/log_controller_test_case"

export default class ActionTests extends LogControllerTestCase {
  identifier = "c"
  fixtureHTML = `
    <div data-controller="c" data-action="keydown@window->c#log">
      <button data-action="c#log"><span>Log</span></button>
      <div id="outer" data-action="click->c#log">
        <div id="inner" data-controller="c" data-action="click->c#log"></div>
      </div>
      <div id="multiple" data-action="click->c#log click->c#log2 mousedown->c#log"></div>
    </div>
    <div id="outside"></div>
  `

  async "test default event"() {
    await this.triggerEvent("button", "click")
    this.assertActions({ name: "log", eventType: "click" })
  }

  async "test bubbling events"() {
    await this.triggerEvent("span", "click")
    this.assertActions({ eventType: "click", currentTarget: this.findElement("button") })
  }

  async "test non-bubbling events"() {
    await this.triggerEvent("span", "click", false)
    this.assertNoActions()
    await this.triggerEvent("button", "click", false)
    this.assertActions({ eventType: "click" })
  }

  async "test nested actions"() {
    const innerController = this.controllers[1]
    await this.triggerEvent("#inner", "click")
    this.assert.ok(true)
    this.assertActions({ controller: innerController, eventType: "click" })
  }

  async "test global actions"() {
    await this.triggerEvent("#outside", "keydown")
    this.assertActions({ name: "log", eventType: "keydown" })
  }

  async "test multiple actions"() {
    await this.triggerEvent("#multiple", "mousedown")
    await this.triggerEvent("#multiple", "click")
    this.assertActions(
      { name: "log", eventType: "mousedown" },
      { name: "log", eventType: "click" },
      { name: "log2", eventType: "click" }
    )
  }
}
