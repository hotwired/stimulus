import { ControllerTestCase } from "../../cases/controller_test_case"
import { OutletController } from "../../controllers/outlet_controller"

const connectOrder: string[] = []

class OutletOrderController extends OutletController {
  connect() {
    connectOrder.push(`${this.identifier}-${this.element.id}-start`)
    super.connect()
    connectOrder.push(`${this.identifier}-${this.element.id}-end`)
  }
}

export default class OutletOrderTests extends ControllerTestCase(OutletOrderController) {
  fixtureHTML = `
    <div data-controller="alpha" id="alpha1" data-alpha-beta-outlet=".beta">Search</div>
    <div data-controller="beta" id="beta-1" class="beta">Beta</div>
    <div data-controller="beta" id="beta-2" class="beta">Beta</div>
    <div data-controller="beta" id="beta-3" class="beta">Beta</div>
  `

  get identifiers() {
    return ["alpha", "beta"]
  }

  async "test can access outlets in connect() even if they are referenced before they are connected"() {
    this.assert.equal(this.controller.betaOutletsInConnectValue, 3)

    this.controller.betaOutlets.forEach((outlet) => {
      this.assert.equal(outlet.identifier, "beta")
      this.assert.equal(Array.from(outlet.element.classList.values()), "beta")
    })

    this.assert.deepEqual(connectOrder, [
      "alpha-alpha1-start",
      "beta-beta-1-start",
      "beta-beta-1-end",
      "beta-beta-2-start",
      "beta-beta-2-end",
      "beta-beta-3-start",
      "beta-beta-3-end",
      "alpha-alpha1-end",
    ])
  }
}
