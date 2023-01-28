import { ControllerTestCase } from "../../cases/controller_test_case"
import { OutletController } from "../../controllers/outlet_controller"

export default class OutletFallbackSelectorTests extends ControllerTestCase(OutletController) {
  fixtureHTML = `
    <div id="container">
      <div data-controller="alpha" id="alpha1"></div>

      <div data-controller="beta" id="beta1">
        <div data-controller="alpha beta" id="mixed"></div>
        <div data-controller="beta" id="beta2"></div>
      </div>

      <div
        data-controller="${this.identifier}"
        data-${this.identifier}-connected-class="connected"
        data-${this.identifier}-disconnected-class="disconnected"
      >
      </div>
    </div>
  `
  get identifiers() {
    return ["test", "alpha", "beta", "gamma"]
  }

  "test OutletSet#find"() {
    this.assert.equal(this.controller.outlets.find("alpha"), this.findElement("#alpha1"))
    this.assert.equal(this.controller.outlets.find("beta"), this.findElement("#beta1"))
    this.assert.equal(this.controller.outlets.find("gamma"), undefined)
  }

  "test OutletSet#findAll"() {
    this.assert.deepEqual(this.controller.outlets.findAll("alpha"), this.findElements("#alpha1", "#mixed"))
    this.assert.deepEqual(this.controller.outlets.findAll("beta"), this.findElements("#beta1", "#mixed", "#beta2"))
    this.assert.deepEqual(this.controller.outlets.findAll("gamma"), [])
  }

  "test OutletSet#findAll with multiple arguments"() {
    this.assert.deepEqual(
      this.controller.outlets.findAll("alpha", "beta"),
      this.findElements("#alpha1", "#mixed", "#beta1", "#mixed", "#beta2")
    )
  }

  "test OutletSet#has"() {
    this.assert.equal(this.controller.outlets.has("alpha"), true)
    this.assert.equal(this.controller.outlets.has("beta"), true)
    this.assert.equal(this.controller.outlets.has("gamma"), false)
  }

  async "test OutletSet#has when no element with selector exists"() {
    const element = document.createElement("div")
    element.setAttribute("data-controller", "gamma")

    this.assert.equal(this.controller.outlets.has("gamma"), false)

    this.controller.element.appendChild(element)
    await this.nextFrame

    this.assert.equal(this.controller.outlets.has("gamma"), true)

    const gammaOutlets = this.controller.gammaOutletElements.filter((outlet) => outlet.classList.contains("connected"))
    this.assert.equal(gammaOutlets.length, 1)
    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 1)
  }

  "test singular linked outlet property throws an error when no outlet is found"() {
    this.findElements("#alpha1", "#mixed", "#beta1", "#mixed", "#beta2").forEach((e) => e.remove())

    this.assert.equal(this.controller.hasAlphaOutlet, false)
    this.assert.equal(this.controller.alphaOutlets.length, 0)
    this.assert.equal(this.controller.alphaOutletElements.length, 0)
    this.assert.throws(() => this.controller.alphaOutlet)
    this.assert.throws(() => this.controller.alphaOutletElement)

    this.assert.equal(this.controller.hasBetaOutlet, false)
    this.assert.equal(this.controller.betaOutlets.length, 0)
    this.assert.equal(this.controller.betaOutletElements.length, 0)
    this.assert.throws(() => this.controller.betaOutlet)
    this.assert.throws(() => this.controller.betaOutletElement)
  }

  "test outlet connected callback fires"() {
    const alphaOutlets = this.controller.alphaOutletElements.filter((outlet) => outlet.classList.contains("connected"))
    const betaOutlets = this.controller.betaOutletElements.filter((outlet) => outlet.classList.contains("connected"))
    const gammaOutlets = this.controller.gammaOutletElements.filter((outlet) => outlet.classList.contains("connected"))

    this.assert.equal(alphaOutlets.length, 2)
    this.assert.equal(this.controller.alphaOutletConnectedCallCountValue, 2)

    this.assert.equal(betaOutlets.length, 3)
    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 3)

    this.assert.equal(gammaOutlets.length, 0)
    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 0)
  }

  async "test outlet disconnect callback fires"() {
    this.findElements("#alpha1", "#mixed", "#beta1", "#mixed", "#beta2").forEach((e) => e.remove())

    await this.nextFrame

    const alphaOutlets = this.controller.alphaOutletElements.filter((outlet) => outlet.classList.contains("connected"))
    const betaOutlets = this.controller.betaOutletElements.filter((outlet) => outlet.classList.contains("connected"))
    const gammaOutlets = this.controller.gammaOutletElements.filter((outlet) => outlet.classList.contains("connected"))

    this.assert.equal(alphaOutlets.length, 0)
    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 2)

    this.assert.equal(betaOutlets.length, 0)
    this.assert.equal(this.controller.betaOutletDisconnectedCallCountValue, 3)

    this.assert.equal(gammaOutlets.length, 0)
    this.assert.equal(this.controller.gammaOutletDisconnectedCallCountValue, 0)
  }
}
