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
    this.setAction(this.buttonElement, "click->c#log:once d#log2:once c#log3:once")

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
    this.setAction(this.buttonElement, "c#log:once d#log2 c#log3")

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
    this.setAction(this.buttonElement, "c#stop:once c#log")

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
    this.setAction(this.buttonElement, "keydown@window->c#log:once")

    await this.nextFrame
    await this.triggerEvent("#outside", "keydown")
    await this.triggerEvent("#outside", "keydown")

    this.assertActions({ name: "log", eventType: "keydown" })
  }

  async "test edge case when updating action list with setAttribute preserves once history"() {
    this.setAction(this.buttonElement, "c#log:once")
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    //modify with a setAttribute and c#log should not be called anyhow
    this.setAction(this.buttonElement, "c#log2 c#log:once d#log")
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c" },
      { name: "log2", identifier: "c" },
      { name: "log", identifier: "d" },
    )
  }

  async "test default passive action"() {
    this.setAction(this.buttonElement, "scroll->c#logPassive:passive")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "scroll", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "scroll", passive: true })
  }

  async "test global passive actions"() {
    this.setAction(this.buttonElement, "mouseup@window->c#logPassive:passive")
    await this.nextFrame

    await this.triggerEvent("#outside", "mouseup", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "mouseup", passive: true })
  }

  async "test passive false actions"() {
    // by default touchmove is true in chrome
    this.setAction(this.buttonElement, "touchmove@window->c#logPassive:!passive")
    await this.nextFrame

    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "touchmove", passive: false })
  }

  async "test multiple options"() {
    // by default touchmove is true in chrome
    this.setAction(this.buttonElement, "touchmove@window->c#logPassive:once:!passive")
    await this.nextFrame

    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    await this.triggerEvent("#outside", "touchmove", { setDefaultPrevented: false })
    this.assertActions({ name: "logPassive", eventType: "touchmove", passive: false })
  }

  async "test wrong options are silently ignored"() {
    this.setAction(this.buttonElement, "c#log:wrong:verywrong")
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", identifier: "c" },
      { name: "log", identifier: "c" }
    )
  }

  async "test stop option with implicit event"() {
    this.setAction(this.element, "click->c#log")
    this.setAction(this.buttonElement, "c#log2:stop")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log2", eventType: "click" }
    )
  }

  async "test stop option with explicit event"() {
    this.setAction(this.element, "keydown->c#log")
    this.setAction(this.buttonElement, "keydown->c#log2:stop")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "keydown")

    this.assertActions(
      { name: "log2", eventType: "keydown" }
    )
  }

  async "test event propagation without stop option"() {
    this.setAction(this.element, "click->c#log")
    this.setAction(this.buttonElement, "c#log2")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log2", eventType: "click" },
      { name: "log", eventType: "click" }
    )
  }

  async "test prevent option with implicit event"() {
    this.setAction(this.buttonElement, "c#log:prevent")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", eventType: "click", defaultPrevented: true }
    )
  }

  async "test prevent option with explicit event"() {
    this.setAction(this.buttonElement, "keyup->c#log:prevent")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "keyup")

    this.assertActions(
      { name: "log", eventType: "keyup", defaultPrevented: true }
    )
  }

  async "test self option absence"() {
    this.setAction(this.buttonElement, "click->c#log")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", eventType: "click" }
    )
  }

  async "test self option presence"() {
    this.setAction(this.buttonElement, "click->c#log:self")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { name: "log", eventType: "click" }
    )
  }

  async "test not-self option presence"() {
    this.setAction(this.buttonElement, "click->c#log:!self")
    await this.nextFrame

    await this.triggerEvent(this.buttonElement, "click")

    this.assertNoActions()
  }

  setAction(element: Element, value: string) {
    element.setAttribute("data-action", value)
  }

  get element() {
    return this.findElement("div")
  }

  get buttonElement() {
    return this.findElement("button")
  }
}
