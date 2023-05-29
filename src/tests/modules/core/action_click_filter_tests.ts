import { LogControllerTestCase } from "../../cases/log_controller_test_case"

export default class ActionClickFilterTests extends LogControllerTestCase {
  identifier = ["a"]

  fixtureHTML = `
    <div data-controller="a">
      <button id="ctrl" data-action="click->a#log ctrl+click->a#log2 meta+click->a#log3"></button>
    </div>
  `

  async "test ignoring clicks with unmatched modifier"() {
    const button = this.findElement("#ctrl")
    await this.triggerMouseEvent(button, "click", { ctrlKey: true })
    await this.nextFrame
    this.assertActions(
      { name: "log", identifier: "a", eventType: "click", currentTarget: button },
      { name: "log2", identifier: "a", eventType: "click", currentTarget: button }
    )
  }
}
