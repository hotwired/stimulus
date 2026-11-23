import { ControllerTestCase } from "../../cases/controller_test_case"
import { TargetController } from "../../controllers/target_controller"

export default class TargetCaseInsensitiveTests extends ControllerTestCase(TargetController) {
  identifier = "CamelCase"
  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <div data-${this.identifier}-target="alpha" id="alpha1"></div>
    </div>
  `

  async "test target connected callback when a target token is added to an existing target attribute"() {
    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 0)

    await this.setAttribute("#alpha1", `data-${this.identifier}-target`, "alpha input")

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
    this.assert.deepEqual(this.controller.inputTargets, [this.findElement("#alpha1")])
  }

  async "test target disconnected callback when a target token is removed from an existing target attribute"() {
    await this.setAttribute("#alpha1", `data-${this.identifier}-target`, "alpha input")
    await this.setAttribute("#alpha1", `data-${this.identifier}-target`, "alpha")

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
  }
}
