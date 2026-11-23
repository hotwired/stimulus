import { ControllerTestCase } from "../../cases/controller_test_case"
import { OutletController } from "../../controllers/outlet_controller"

export default class OutletCaseInsensitiveTests extends ControllerTestCase(OutletController) {
  identifier = ["CamelCase", "beta", "gamma"]
  fixtureHTML = `
    <div data-controller="CamelCase" data-CamelCase-beta-outlet="#beta1" data-CamelCase-gamma-outlet="#doesntexist">
      <div data-controller="beta" id="beta1"></div>
      <div data-controller="gamma" id="gamma1"></div>
    </div>
  `

  get controller() {
    const element = this.fixtureElement.firstElementChild!
    return this.application.getControllerForElementAndIdentifier(element, "CamelCase") as OutletController
  }

  async "test outlet connect callback when the controlled element's outlet attribute changes"() {
    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 0)

    await this.setAttribute(this.controller.element, "data-CamelCase-gamma-outlet", "#gamma1")

    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 1)
    this.assert.equal(this.controller.outlets.find("gamma"), this.findElement("#gamma1"))
  }

  async "test outlet disconnect callback when the controlled element's outlet attribute is removed"() {
    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 1)
    this.assert.equal(this.controller.betaOutletDisconnectedCallCountValue, 0)

    await this.removeAttribute(this.controller.element, "data-CamelCase-beta-outlet")

    this.assert.equal(this.controller.betaOutletDisconnectedCallCountValue, 1)
  }
}
