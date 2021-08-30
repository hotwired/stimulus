import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class ActionTests extends LogControllerTestCase {
  identifier = "c"
  fixtureHTML = `
    <div data-controller="c" data-action="keydown@window->c#log">
      <button data-action="c#log"><span>Log</span></button>
      <div id="outer" data-action="click->c#log">
        <div id="inner" data-controller="c" data-action="click->c#log keyup@window->c#log"></div>
      </div>
      <div id="multiple" data-action="click->c#log click->c#log2 mousedown->c#log"></div>
    </div>
    <div id="outside"></div>
    <svg id="svgRoot" data-controller="c" data-action="click->c#log">
      <circle id="svgChild" data-action="mousedown->c#log" cx="5" cy="5" r="5">
    </svg>
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
    await this.triggerEvent("span", "click", { bubbles: false })
    this.assertNoActions()
    await this.triggerEvent("button", "click", { bubbles: false })
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

  async "test nested global actions"() {
    const innerController = this.controllers[1]
    await this.triggerEvent("#outside", "keyup")
    this.assertActions({ controller: innerController, eventType: "keyup" })
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

  async "test actions on svg elements"() {
    await this.triggerEvent("#svgRoot", "click")
    await this.triggerEvent("#svgChild", "mousedown")
    this.assertActions(
      { name: "log", eventType: "click" },
      { name: "log", eventType: "mousedown" }
    )
  }
}
