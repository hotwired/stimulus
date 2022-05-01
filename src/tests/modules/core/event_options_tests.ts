import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class EventOptionsTests extends LogControllerTestCase {
  identifier = ["c", "d"]
  fixtureHTML = `
    <div data-controller="c d">
      <button></button>
    </div>
    <div id="outside"></div>
  `
  async "test different syntaxes for once action"() {
    this.actionValue = { value: "click->c#log:once d#log2:once c#log3:once", element: this.buttonElement }

    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
    )
  }

  async "test mix once and standard actions"() {
    this.actionValue = { value: "c#log:once d#log2 c#log3", element: this.buttonElement }

    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log2", identifier: "d", eventType: "click", currentTarget: this.buttonElement },
      { name: "log3", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
    )
  }

  async "test stop propagation with once"() {
    this.actionValue = { value: "c#stop:once c#log", element: this.buttonElement }

    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "stop", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
    )

    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    this.assertActions(
      { name: "stop", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
      { name: "log", identifier: "c", eventType: "click", currentTarget: this.buttonElement },
    )
  }

  async "test global once actions"() {
    this.actionValue = { value: "keydown@window->c#log:once", element: this.buttonElement }

    await this.nextFrame
    await this.triggerEvent("#outside", "keydown")
    await this.triggerEvent("#outside", "keydown")

    this.assertActions({ name: "log", eventType: "keydown" })
  }

  async "test edge case when updating action list with setAttribute preserves once history"() {
    this.actionValue = { value: "c#log:once", element: this.buttonElement }
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    //modify with a setAttribute and c#log should not be called anyhow
    this.actionValue = { value: "c#log2 c#log:once d#log", element: this.buttonElement }
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c" },
      { name: "log2", identifier: "c" },
      { name: "log", identifier: "d" },
    )
  }

  async "test default passive action"() {
    this.actionValue = { value: "scroll->c#logPassive:passive", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "scroll", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "scroll", passive: true })
  }

  async "test global passive actions"() {
    this.actionValue = { value: "mouseup@window->c#logPassive:passive", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent("#outside", "mouseup", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "mouseup", passive: true })
  }

  async "test passive false actions"() {
    // by default touchmove is true in chrome
    this.actionValue = { value: "touchmove@window->c#logPassive:!passive", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "touchmove", passive: false })
  }

  async "test multiple options"() {
    // by default touchmove is true in chrome
    this.actionValue = { value: "touchmove@window->c#logPassive:once:!passive", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "touchmove", passive: false })
  }

  async "test wrong options are silently ignored"() {
    this.actionValue = { value: "c#log:wrong:verywrong", element: this.buttonElement }
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c" },
      { name: "log", identifier: "c" }
    )
  }

  async "test stop option with implicit event"() {
    this.actionValue = { value: "click->c#log" }
    this.actionValue = { value: "c#log2:stop", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log2", eventType: "click" }
    )
  }

  async "test stop option with explicit event"() {
    this.actionValue = { value: "keydown->c#log" }
    this.actionValue = { value: "keydown->c#log2:stop", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "keydown")

    this.assertActions(
      { name: "log2", eventType: "keydown" }
    )
  }

  async "test event propagation without stop option"() {
    this.actionValue = { value: "click->c#log" }
    this.actionValue = { value: "c#log2", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log2", eventType: "click" },
      { name: "log", eventType: "click" }
    )
  }

  async "test prevent option with implicit event"() {
    this.actionValue = { value: "c#log:prevent", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", eventType: "click", defaultPrevented: true }
    )
  }

  async "test prevent option with explicit event"() {
    this.actionValue = { value: "keyup->c#log:prevent", element: this.buttonElement }
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "keyup")

    this.assertActions(
      { name: "log", eventType: "keyup", defaultPrevented: true }
    )
  }

  set actionValue(config: { value: string, element?: Element }) {
    (config.element || this.element).setAttribute("data-action", config.value)
  }

  get element() {
    return this.findElement("div")
  }

  get buttonElement() {
    return this.findElement("button")
  }
}
