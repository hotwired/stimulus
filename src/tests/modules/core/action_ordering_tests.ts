import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class ActionOrderingTests extends LogControllerTestCase {
  identifier = ["c", "d"]
  fixtureHTML = `
    <div data-controller="c d" data-action="click->c#log">
      <button data-action="c#log d#log2"></button>
    </div>
  `

  async "test adding an action to the right"() {
    this.actionValue = "c#log d#log2 c#log3"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test adding an action to the left"() {
    this.actionValue = "c#log3 c#log d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test removing an action from the right"() {
    this.actionValue = "c#log d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test removing an action from the left"() {
    this.actionValue = "d#log2 c#log3"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test replacing an action on the left"() {
    this.actionValue = "d#log2 c#log3"
    await this.nextFrame
    this.actionValue = "c#log d#log2 c#log3"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test stopping an action"() {
    this.actionValue = "c#log d#stop c#log3"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "stop", identifier: "d", eventType: "click", currentTarget: this.buttonElement }
    )
  }

  async "test disconnecting a controller disconnects its actions"() {
    this.controllerValue = "c"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  set controllerValue(value: string) {
    this.element.setAttribute("data-controller", value)
  }

  set actionValue(value: string) {
    this.buttonElement.setAttribute("data-action", value)
  }

  get element() {
    return this.findElement("div")
  }

  get buttonElement() {
    return this.findElement("button")
  }
}
