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

  async "test adding an action to the left with a :stop modifier"() {
    this.actionValue = "c#log3:stop c#log d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement }
    )
  }

  async "test adding an action to the left with a :prevent modifier"() {
    this.actionValue = "c#log3:prevent c#log d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test adding an action to the left with a :self modifier"() {
    this.actionValue = "c#log3:self c#log d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test adding an action to the left with a custom action option"() {
    this.application.registerActionOption("custom", () => true)
    this.actionValue = "c#log3:custom c#log d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.element }
    )
  }

  async "test actions with only Stimulus action options share one event listener"() {
    this.application.registerActionOption("custom", () => true)
    this.actionValue = "c#log:prevent c#log2:self d#log2:custom c#log3"
    await this.nextFrame

    const listeners = this.application.dispatcher.eventListeners.filter(
      (listener) => listener.eventTarget === this.buttonElement
    )
    this.assert.equal(listeners.length, 1)
  }

  async "test actions with a native action option keep their own event listener"() {
    this.actionValue = "c#log:capture d#log2"
    await this.nextFrame

    const listeners = this.application.dispatcher.eventListeners.filter(
      (listener) => listener.eventTarget === this.buttonElement
    )
    this.assert.equal(listeners.length, 2)
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
