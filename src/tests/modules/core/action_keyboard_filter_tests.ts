import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class ActionKeyboardFilterTests extends LogControllerTestCase {
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
    </div>
  `

  async "test ignore event handlers associated with modifiers other than Enter"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Enter'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than Space"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: ' '})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than Space on ie"() {
    const button = this.findElement("#button1")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Spacebar'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than Tab"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Tab'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than Escape"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Escape'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than Escape on ie"() {
    const button = this.findElement("#button2")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Esc'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowUp"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'ArrowUp'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowDown"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'ArrowDown'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowUp on ie"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Up'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowDown on ie"() {
    const button = this.findElement("#button3")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Down'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowLeft"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'ArrowLeft'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowRight"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'ArrowRight'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowLeft on ie"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Left'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than ArrowRight on ie"() {
    const button = this.findElement("#button4")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Right'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than Home"() {
    const button = this.findElement("#button5")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Home'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test ignore event handlers associated with modifiers other than End"() {
    const button = this.findElement("#button5")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'End'})
    this.assertActions(
      {name: "log2", identifier: "a", eventType: 'keydown', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keydown', currentTarget: button}
    )
  }

  async "test keyup"() {
    const button = this.findElement("#button6")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keyup", {key: 'End'})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keyup', currentTarget: button},
      {name: "log3", identifier: "a", eventType: 'keyup', currentTarget: button}
    )
  }

  async "test global event"() {
    const button = this.findElement("#button7")
    await this.nextFrame
    await this.triggerKeyboardEvent(button, "keydown", {key: 'Escape', bubbles: true})
    this.assertActions(
      {name: "log", identifier: "a", eventType: 'keydown', currentTarget: document},
    )
  }
}
