import { ControllerTestCase } from "../../cases/controller_test_case"
import { OutletController } from "../../controllers/outlet_controller"

export default class OutletOrderTests extends ControllerTestCase(OutletController) {
  fixtureHTML = `
    <div data-controller="alpha" data-alpha-beta-outlet=".beta">Search</div>
    <div data-controller="beta" class="beta">Beta</div>
    <div data-controller="beta" class="beta">Beta</div>
    <div data-controller="beta" class="beta">Beta</div>
  `

  get identifiers() {
    return ["alpha", "beta"]
  }

  async "test can access outlets in connect() even if they are referenced before they are connected"() {
    this.assert.equal(this.controller.betaOutletsInConnectValue, 3)

    this.controller.betaOutlets.forEach(outlet => {
      this.assert.equal(outlet.identifier, "beta")
      this.assert.equal(Array.from(outlet.element.classList.values()), "beta")
    })
  }
}
