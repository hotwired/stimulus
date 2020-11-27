import { LogControllerTestCase } from "../log_controller_test_case"

export default class EventOptionsTests extends LogControllerTestCase {
  identifier = ["c", "d"]
  fixtureHTML = `
    <div data-controller="c d">
      <button data-first-param="first"
              data-second-parameter-param="second"
              data-param-something="not-reported"
              data-something="not-reported">
        <div id="nested"></div>
      </button>
    </div>
  `
  async "test clicking on the element does return its params"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { first: "first", secondParameter: "second" } },
    )
  }

  async "test clicking on the element does return params to multiple controllers"() {
    this.actionValue = "click->c#log click->d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { first: "first", secondParameter: "second" } },
      { identifier: "d", params: { first: "first", secondParameter: "second" } }
    )
  }

  async "test updating manually the params values"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { first: "first", secondParameter: "second" } },
    )

    await this.buttonElement.setAttribute("data-first-param", "updated")
    await this.buttonElement.setAttribute("data-new-param", "new")
    await this.buttonElement.removeAttribute("data-second-parameter-param")
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { first: "first", secondParameter: "second" } },
      { identifier: "c", params: { first: "updated", new: "new"} },
    )
  }

  async "test clicking on a nested element does return the params of the actionable element"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.nestedElement, "click")

    this.assertActions({ params: { first: "first", secondParameter: "second" } })
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

  get nestedElement() {
    return this.findElement("#nested")
  }
}
