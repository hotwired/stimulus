import { LogControllerTestCase } from "../cases/log_controller_test_case"

export default class EventOptionsTests extends LogControllerTestCase {
  identifier = ["c", "d"]
  fixtureHTML = `
    <div data-controller="c d">
      <button></button>
    </div>
    <div id="outside"></div>
  `
  async "test different syntaxes for once action"() {
    this.actionValue = "click->c#log:once d#log2:once c#log3:once"

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
    this.actionValue = "c#log:once d#log2 c#log3"

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
    this.actionValue = "c#stop:once c#log"

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
    this.actionValue = "keydown@window->c#log:once"

    await this.nextFrame
    await this.triggerEvent("#outside", "keydown")
    await this.triggerEvent("#outside", "keydown")

    this.assertActions({ name: "log", eventType: "keydown" })
  }

  async "test edge case when updating action list with setAttribute preserves once history"() {
    this.actionValue = "c#log:once"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    //modify with a setAttribute and c#log should not be called anyhow
    this.actionValue = "c#log2 c#log:once d#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c" },
      { name: "log2", identifier: "c" },
      { name: "log", identifier: "d" },
    )
  }

  async "test default passive action"() {
    this.actionValue = "scroll->c#logPassive:passive"
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "scroll", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "scroll", passive: true })
  }

  async "test global passive actions"() {
    this.actionValue = "mouseup@window->c#logPassive:passive"
    await this.nextFrame

    await this.triggerEvent("#outside", "mouseup", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "mouseup", passive: true })
  }

  async "test passive false actions"() {
    // by default touchmove is true in chrome
    this.actionValue = "touchmove@window->c#logPassive:!passive"
    await this.nextFrame

    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "touchmove", passive: false })
  }

  async "test multiple options"() {
    // by default touchmove is true in chrome
    this.actionValue = "touchmove@window->c#logPassive:once:!passive"
    await this.nextFrame

    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "touchmove", passive: false })
  }

  async "test wrong options are silently ignored"() {
    this.actionValue = "c#log:wrong:verywrong"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c" },
      { name: "log", identifier: "c" }
    )
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
