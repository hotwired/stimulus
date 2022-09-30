import ActionParamsTests from "./action_params_tests"

export default class ActionParamsCaseInsensitiveTests extends ActionParamsTests {
  identifier = ["CamelCase", "AnotherOne"]
  fixtureHTML = `
    <div data-controller="CamelCase AnotherOne">
      <button data-CamelCase-id-param="123"
              data-CamelCase-multi-word-example-param="/path"
              data-CamelCase-active-param="true"
              data-CamelCase-inactive-param="false"
              data-CamelCase-empty-param=""
              data-CamelCase-payload-param='${JSON.stringify({ value: 1 })}'
              data-CamelCase-param-something="not-reported"
              data-Something-param="not-reported"
              data-AnotherOne-id-param="234">
        <div id="nested"></div>
      </button>
    </div>
    <div id="outside"></div>
  `
  expectedParamsForCamelCase = {
    id: 123,
    multiWordExample: "/path",
    payload: {
      value: 1,
    },
    active: true,
    empty: "",
    inactive: false,
  }

  async "test clicking on the element does return its params"() {
    this.actionValue = "click->CamelCase#log"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions({ identifier: "CamelCase", params: this.expectedParamsForCamelCase })
  }

  async "test global event return element params where the action is defined"() {
    this.actionValue = "keydown@window->CamelCase#log"
    await this.nextFrame
    await this.triggerEvent("#outside", "keydown")

    this.assertActions({ identifier: "CamelCase", params: this.expectedParamsForCamelCase })
  }

  async "test passing params to namespaced controller"() {
    this.actionValue = "click->CamelCase#log click->AnotherOne#log2"
    await this.nextFrame
    await this.triggerEvent(this.buttonElement, "click")

    this.assertActions(
      { identifier: "CamelCase", params: this.expectedParamsForCamelCase },
      { identifier: "AnotherOne", params: { id: 234 } }
    )
  }
}
