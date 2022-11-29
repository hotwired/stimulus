import { TestApplication } from "../../cases/application_test_case"
import { LogControllerTestCase } from "../../cases/log_controller_test_case"
import { Schema, defaultSchema } from "../../../core/schema"
import { Application } from "../../../core/application"

const customSchema = { ...defaultSchema, keyMappings: { ...defaultSchema.keyMappings, a: "a", b: "b" } }

export default class ActionKeyboardFilterTests extends LogControllerTestCase {
  schema: Schema = customSchema
  application: Application = new TestApplication(this.fixtureElement, this.schema)

  identifier = ["a"]
  fixtureHTML = `
    <div data-controller="a" data-action="keydown.esc@document->a#log">
      <button id="button1" data-action="keydown.enter->a#log keydown.space->a#log2 keydown->a#log3"></button>
      <button id="button2" data-action="keydown.tab->a#log   keydown.esc->a#log2   keydown->a#log3"></button>
      <button id="button3" data-action="keydown.up->a#log    keydown.down->a#log2  keydown->a#log3"></button>
      <button id="button4" data-action="keydown.left->a#log  keydown.right->a#log2 keydown->a#log3"></button>
      <button id="button5" data-action="keydown.home->a#log  keydown.end->a#log2   keydown->a#log3"></button>
      <button id="button6" data-action="keyup.end->a#log     keyup->a#log3"></button>
      <button id="button7"></button>
      <button id="button8" data-action="keydown.a->a#log keydown.b->a#log2"></button>
      <button id="button9" data-action="keydown.shift+a->a#log keydown.a->a#log2 keydown.ctrl+shift+a->a#log3">
      <button id="button10" data-action="jquery.custom.event->a#log jquery.a->a#log2">
    </div>
  `

  async "test ignore event handlers associated with modifiers other than Enter"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Enter" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Space"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: " " })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Tab"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Tab" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Escape"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Escape" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowUp"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowUp" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowDown"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowDown" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowLeft"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowLeft" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowRight"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "ArrowRight" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than Home"() {
    const button = this.findElement("#button5")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Home" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test ignore event handlers associated with modifiers other than End"() {
    const button = this.findElement("#button5")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "End" })
    this.assertActions(
      { name: "log2", identifier: "a", eventType: "keydown", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keydown", currentTarget: button }
    )
  }

  async "test keyup"() {
    const button = this.findElement("#button6")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keyup", { key: "End" })
    this.assertActions(
      { name: "log", identifier: "a", eventType: "keyup", currentTarget: button },
      { name: "log3", identifier: "a", eventType: "keyup", currentTarget: button }
    )
  }

  async "test global event"() {
    const button = this.findElement("#button7")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "Escape", bubbles: true })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: document })
  }

  async "test custom keymapping: a"() {
    const button = this.findElement("#button8")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "a" })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test custom keymapping: b"() {
    const button = this.findElement("#button8")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "b" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test custom keymapping: unknown c"() {
    const button = this.findElement("#button8")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "c" })
    this.assertActions()
  }

  async "test ignore event handlers associated with modifiers other than shift+a"() {
    const button = this.findElement("#button9")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "A", shiftKey: true })
    this.assertActions({ name: "log", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore event handlers associated with modifiers other than a"() {
    const button = this.findElement("#button9")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "a" })
    this.assertActions({ name: "log2", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore event handlers associated with modifiers other than ctrol+shift+a"() {
    const button = this.findElement("#button9")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", { key: "A", ctrlKey: true, shiftKey: true })
    this.assertActions({ name: "log3", identifier: "a", eventType: "keydown", currentTarget: button })
  }

  async "test ignore filter syntax when not a keyboard event"() {
    const button = this.findElement("#button10")
    await this.nextFrame
    await this.triggerEvent(button, "jquery.custom.event")
    this.assertActions({ name: "log", identifier: "a", eventType: "jquery.custom.event", currentTarget: button })
  }

  async "test ignore filter syntax when not a keyboard event (case2)"() {
    const button = this.findElement("#button10")
    await this.nextFrame
    await this.triggerEvent(button, "jquery.a")
    this.assertActions({ name: "log2", identifier: "a", eventType: "jquery.a", currentTarget: button })
  }
}
