import { LogControllerTestCase } from "../log_controller_test_case"

export default class EventOptionsTests extends LogControllerTestCase {
  identifier = ["c", "d"]
  fixtureHTML = `
    <div data-controller="c d">
      <button data-id-param="123"
              data-multi-word-example-param="/path"
              data-active-param="true"
              data-payload-param='${JSON.stringify({value: 1})}'
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
      { identifier: "c", params: { id: 123, multiWordExample: "/path", payload: { value: 1 }, active: true } },
    )
  }

  async "test clicking on the element does return params to multiple controllers"() {
    this.actionValue = "click->c#log click->d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { id: 123, multiWordExample: "/path", payload: { value: 1 }, active: true } },
      { identifier: "d", params: { id: 123, multiWordExample: "/path", payload: { value: 1 }, active: true } },
    )
  }

  async "test updating manually the params values"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { id: 123, multiWordExample: "/path", payload: { value: 1 }, active: true } },
    )

    await this.buttonElement.setAttribute("data-id-param", "234")
    await this.buttonElement.setAttribute("data-new-param", "new")
    await this.buttonElement.removeAttribute("data-payload-param")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: { id: 123, multiWordExample: "/path", payload: { value: 1 }, active: true } },
      { identifier: "c", params: { id: 234, multiWordExample: "/path", new: "new", active: true } },
    )
  }

  async "test clicking on a nested element does return the params of the actionable element"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.nestedElement, "click")

    this.assertActions({ identifier: "c", params: { id: 123, multiWordExample: "/path", payload: { value: 1 }, active: true } })
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
