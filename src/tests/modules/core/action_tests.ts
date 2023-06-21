import { Action } from "../../../core/action"
import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class ActionTests extends LogControllerTestCase {
  identifier = "c"
  fixtureHTML = `
    <div data-controller="c" data-action="keydown@window->c#log focus@outside->c#log">
      <button id="outer-sibling-button" data-action="c#log"><span>Log</span></button>
      <div id="outer" data-action="hover@outside->c#log click->c#log">
        <div id="inner" data-controller="c" data-action="click->c#log keyup@window->c#log"></div>
      </div>
      <div id="multiple" data-action="click->c#log click->c#log2 mousedown->c#log"></div>
    </div>
    <div id="outside">
      <button type="button" id="outside-inner-button">Outside inner button</button>
    </div>
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
    this.assertActions({ name: "log", eventType: "click" }, { name: "log", eventType: "mousedown" })
  }

  async "test global 'outside' action that excludes outside elements"() {
    await this.triggerEvent("#outer-sibling-button", "focus")

    this.assertNoActions()

    await this.triggerEvent("#outside-inner-button", "focus")
    await this.triggerEvent("#svgRoot", "focus")

    this.assertActions({ name: "log", eventType: "focus" }, { name: "log", eventType: "focus" })

    // validate that the action token string correctly resolves to the original action
    const attributeName = "data-action"
    const element = document.getElementById("outer") as Element
    const [content] = (element.getAttribute("data-action") || "").split(" ")
    const action = Action.forToken({ content, element, index: 0, attributeName }, this.application.schema)

    this.assert.equal("hover@outside->c#log", `${action}`)
  }

  async "test global 'outside' action that excludes the element with attached action"() {
    // an event from inside the controlled element but outside the element with the action
    await this.triggerEvent("#inner", "hover")

    // an event on the element with the action
    await this.triggerEvent("#outer", "hover")

    this.assertNoActions()

    // an event inside the controlled element but outside the element with the action
    await this.triggerEvent("#outer-sibling-button", "hover")
    this.assertActions({ name: "log", eventType: "hover" })
  }
}
