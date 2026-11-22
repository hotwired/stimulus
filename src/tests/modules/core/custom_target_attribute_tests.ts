import { defaultSchema } from "../../../core/schema"
import { ControllerTestCase } from "../../cases/controller_test_case"
import { TargetController } from "../../controllers/target_controller"

export default class CustomTargetAttributeTests extends ControllerTestCase(TargetController) {
  schema = {
    ...defaultSchema,
    targetAttributeForScope: (identifier: string) => `data-targets-for-${identifier}`,
  }

  fixtureHTML = `
    <div data-controller="${this.identifier}" data-${this.identifier}-connected-class="connected" data-${this.identifier}-disconnected-class="disconnected">
      <input id="custom" data-targets-for-${this.identifier}="input">
      <input id="standard" data-${this.identifier}-target="input">
    </div>
  `

  async "test target callbacks use the schema's target attribute"() {
    const target = this.findElement("#custom")
    const standard = this.findElement("#standard")
    const attributeName = this.schema.targetAttributeForScope(this.controller.identifier)

    this.assert.deepEqual(this.controller.inputTargets, [target])
    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
    this.assert.ok(target.classList.contains("connected"))
    this.assert.notOk(standard.classList.contains("connected"))

    await this.removeAttribute(target, attributeName)
    this.assert.notOk(this.controller.hasInputTarget)
    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
    this.assert.ok(target.classList.contains("disconnected"))

    await this.setAttribute(target, attributeName, "input")
    this.assert.deepEqual(this.controller.inputTargets, [target])
    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 2)
  }
}
