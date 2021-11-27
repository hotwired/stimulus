import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class ActionParamsTests extends LogControllerTestCase {
  identifier = ["c", "d"]
  fixtureHTML = `
    <div data-controller="c d">
      <button data-c-id-param="123"
              data-c-multi-word-example-param="/path"
              data-c-active-param="true"
              data-c-inactive-param="false"
              data-c-empty-param=""
              data-c-payload-param='${JSON.stringify({value: 1})}'
              data-c-param-something="not-reported"
              data-something-param="not-reported"
              data-d-id-param="234">
        <div id="nested"></div>
      </button>
    </div>
    <div id="outside"></div>
  `
  expectedParamsForC = {
    id: 123,
    multiWordExample: "/path",
    payload: {
      value: 1
    },
    active: true,
    empty: "",
    inactive: false
  }

  async "test clicking on the element does return its params"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: this.expectedParamsForC },
    )
  }

  async "test global event return element params where the action is defined"() {
    this.actionValue = "keydown@window->c#log"
    await this.nextFrame
    await this.triggerEvent("#outside", "keydown")

    this.assertActions(
      { identifier: "c", params: this.expectedParamsForC },
    )
  }

  async "test passing params to namespaced controller"() {
    this.actionValue = "click->c#log click->d#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: this.expectedParamsForC },
      { identifier: "d", params: { id: 234 } },
    )
  }

  async "test updating manually the params values"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: this.expectedParamsForC },
    )

    await this.buttonElement.setAttribute("data-c-id-param", "234")
    await this.buttonElement.setAttribute("data-c-new-param", "new")
    await this.buttonElement.removeAttribute("data-c-payload-param")
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "c", params: this.expectedParamsForC },
      {
        identifier: "c", params: {
          id: 234, new: "new",
          multiWordExample: "/path",
          active: true,
          empty: "",
          inactive: false} },
    )
  }

  async "test clicking on a nested element does return the params of the actionable element"() {
    this.actionValue = "click->c#log"
    await this.nextFrame
    await this.triggerEvent(this.nestedElement, "click")

    this.assertActions({ identifier: "c", params: this.expectedParamsForC })
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
