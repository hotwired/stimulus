import { ControllerTestCase } from "../../cases/controller_test_case"
import { OutletController } from "../../controllers/outlet_controller"

export default class OutletTests extends ControllerTestCase(OutletController) {
  fixtureHTML = `
    <div id="container">
      <div data-controller="alpha" class="alpha" id="alpha1"></div>
      <div data-controller="alpha" class="alpha" id="alpha2"></div>

      <div data-controller="beta" class="beta" id="beta1">
        <div data-controller="beta" class="beta" id="beta2"></div>
        <div id="beta3"></div>
        <div data-controller="beta" id="beta4"></div>
      </div>

      <div
        data-controller="${this.identifier}"
        data-${this.identifier}-connected-class="connected"
        data-${this.identifier}-disconnected-class="disconnected"
        data-${this.identifier}-alpha-outlet="#alpha1,#alpha2"
        data-${this.identifier}-beta-outlet=".beta"
        data-${this.identifier}-delta-outlet=".delta"
        data-${this.identifier}-namespaced--epsilon-outlet=".epsilon"
      >
        <div data-controller="gamma" class="gamma" id="gamma2"></div>
      </div>

      <div data-controller="delta gamma" class="delta gamma" id="delta1">
        <div data-controller="gamma" class="gamma" id="gamma1"></div>
      </div>

      <div data-controller="namespaced--epsilon" class="epsilon" id="epsilon1"></div>

      <div data-controller="namespaced--epsilon" class="epsilon" id="epsilon2"></div>

      <div class="beta" id="beta5"></div>
    </div>
  `
  get identifiers() {
    return ["test", "alpha", "beta", "gamma", "delta", "omega", "namespaced--epsilon"]
  }

  "test OutletSet#find"() {
    this.assert.equal(this.controller.outlets.find("alpha"), this.findElement("#alpha1"))
    this.assert.equal(this.controller.outlets.find("beta"), this.findElement("#beta1"))
    this.assert.equal(this.controller.outlets.find("delta"), this.findElement("#delta1"))
    this.assert.equal(this.controller.outlets.find("namespaced--epsilon"), this.findElement("#epsilon1"))
  }

  "test OutletSet#findAll"() {
    this.assert.deepEqual(this.controller.outlets.findAll("alpha"), this.findElements("#alpha1", "#alpha2"))
    this.assert.deepEqual(this.controller.outlets.findAll("beta"), this.findElements("#beta1", "#beta2"))
    this.assert.deepEqual(
      this.controller.outlets.findAll("namespaced--epsilon"),
      this.findElements("#epsilon1", "#epsilon2")
    )
  }

  "test OutletSet#findAll with multiple arguments"() {
    this.assert.deepEqual(
      this.controller.outlets.findAll("alpha", "beta", "namespaced--epsilon"),
      this.findElements("#alpha1", "#alpha2", "#beta1", "#beta2", "#epsilon1", "#epsilon2")
    )
  }

  "test OutletSet#has"() {
    this.assert.equal(this.controller.outlets.has("alpha"), true)
    this.assert.equal(this.controller.outlets.has("beta"), true)
    this.assert.equal(this.controller.outlets.has("gamma"), false)
    this.assert.equal(this.controller.outlets.has("delta"), true)
    this.assert.equal(this.controller.outlets.has("omega"), false)
    this.assert.equal(this.controller.outlets.has("namespaced--epsilon"), true)
  }

  "test OutletSet#has when attribute gets added later"() {
    this.assert.equal(this.controller.outlets.has("gamma"), false)
    this.controller.element.setAttribute(`data-${this.identifier}-gamma-outlet`, ".gamma")
    this.assert.equal(this.controller.outlets.has("gamma"), true)
  }

  "test OutletSet#has when no element with selector exists"() {
    this.controller.element.setAttribute(`data-${this.identifier}-gamma-outlet`, "#doesntexist")
    this.assert.equal(this.controller.outlets.has("gamma"), false)
  }

  "test OutletSet#has when selector matches but element doesn't have the right controller"() {
    this.controller.element.setAttribute(`data-${this.identifier}-gamma-outlet`, ".alpha")
    this.assert.equal(this.controller.outlets.has("gamma"), false)
  }

  "test linked outlet properties"() {
    const element = this.findElement("#beta1")
    const betaOutlet = this.controller.application.getControllerForElementAndIdentifier(element, "beta")
    this.assert.equal(this.controller.betaOutlet, betaOutlet)
    this.assert.equal(this.controller.betaOutletElement, element)

    const elements = this.findElements("#beta1", "#beta2")
    const betaOutlets = elements.map((element) =>
      this.controller.application.getControllerForElementAndIdentifier(element, "beta")
    )
    this.assert.deepEqual(this.controller.betaOutlets, betaOutlets)
    this.assert.deepEqual(this.controller.betaOutletElements, elements)

    this.assert.equal(this.controller.hasBetaOutlet, true)
  }

  "test inherited linked outlet properties"() {
    const element = this.findElement("#alpha1")
    const alphaOutlet = this.controller.application.getControllerForElementAndIdentifier(element, "alpha")
    this.assert.equal(this.controller.alphaOutlet, alphaOutlet)
    this.assert.equal(this.controller.alphaOutletElement, element)

    const elements = this.findElements("#alpha1", "#alpha2")
    const alphaOutlets = elements.map((element) =>
      this.controller.application.getControllerForElementAndIdentifier(element, "alpha")
    )
    this.assert.deepEqual(this.controller.alphaOutlets, alphaOutlets)
    this.assert.deepEqual(this.controller.alphaOutletElements, elements)
  }

  "test singular linked outlet property throws an error when no outlet is found"() {
    this.findElements("#alpha1", "#alpha2").forEach((e) => {
      e.removeAttribute("id")
      e.removeAttribute("class")
      e.removeAttribute("data-controller")
    })

    this.assert.equal(this.controller.hasAlphaOutlet, false)
    this.assert.equal(this.controller.alphaOutlets.length, 0)
    this.assert.equal(this.controller.alphaOutletElements.length, 0)
    this.assert.throws(() => this.controller.alphaOutlet)
    this.assert.throws(() => this.controller.alphaOutletElement)
  }

  async "test outlet connected callback fires"() {
    const alphaOutlets = this.controller.alphaOutletElements.filter((outlet) => outlet.classList.contains("connected"))

    this.assert.equal(alphaOutlets.length, 2)
    this.assert.equal(this.controller.alphaOutletConnectedCallCountValue, 2)
  }

  "test outlet connected callback fires for namespaced outlets"() {
    const epsilonOutlets = this.controller.namespacedEpsilonOutletElements.filter((outlet) =>
      outlet.classList.contains("connected")
    )
    this.assert.equal(epsilonOutlets.length, 2)
    this.assert.equal(this.controller.namespacedEpsilonOutletConnectedCallCountValue, 2)
  }

  async "test outlet connected callback when element is inserted"() {
    const betaOutletElement = document.createElement("div")
    await this.setAttribute(betaOutletElement, "class", "beta")
    await this.setAttribute(betaOutletElement, "data-controller", "beta")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 2)

    await this.appendChild(this.controller.element, betaOutletElement)

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 3)
    this.assert.ok(
      betaOutletElement.classList.contains("connected"),
      `expected "${betaOutletElement.className}" to contain "connected"`
    )
    this.assert.ok(betaOutletElement.isConnected, "element is present in document")

    await this.appendChild("#container", betaOutletElement.cloneNode(true))

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 4)
  }

  async "test outlet connected callback when present element adds matching outlet selector attribute"() {
    const element = this.findElement("#beta3")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 2)

    await this.setAttribute(element, "data-controller", "beta")
    await this.setAttribute(element, "class", "beta")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 3)
    this.assert.ok(element.classList.contains("connected"), `expected "${element.className}" to contain "connected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test outlet connected callback when present element already has connected controller and adds matching outlet selector attribute"() {
    const element = this.findElement("#beta4")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 2)

    await this.setAttribute(element, "class", "beta")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 3)
    this.assert.ok(element.classList.contains("connected"), `expected "${element.className}" to contain "connected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test outlet connect callback when an outlet present in the document adds a matching data-controller attribute"() {
    const element = this.findElement("#beta5")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 2)

    await this.setAttribute(element, "data-controller", "beta")

    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 3)
    this.assert.ok(element.classList.contains("connected"), `expected "${element.className}" to contain "connected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test outlet disconnected callback fires when calling disconnect() on the controller"() {
    this.assert.equal(
      this.controller.alphaOutletElements.filter((outlet) => outlet.classList.contains("disconnected")).length,
      0
    )
    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 0)

    this.controller.context.disconnect()
    await this.nextFrame

    this.assert.equal(
      this.controller.alphaOutletElements.filter((outlet) => outlet.classList.contains("disconnected")).length,
      2
    )
    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 2)
  }

  async "test outlet disconnected callback when element is removed"() {
    const disconnectedAlpha = this.findElement("#alpha1")

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 0)
    this.assert.notOk(
      disconnectedAlpha.classList.contains("disconnected"),
      `expected "${disconnectedAlpha.className}" not to contain "disconnected"`
    )

    await this.remove(disconnectedAlpha)

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 1)
    this.assert.ok(
      disconnectedAlpha.classList.contains("disconnected"),
      `expected "${disconnectedAlpha.className}" to contain "disconnected"`
    )
    this.assert.notOk(disconnectedAlpha.isConnected, "element is not present in document")
  }

  async "test outlet disconnected callback when element is removed with namespaced outlet"() {
    const disconnectedEpsilon = this.findElement("#epsilon1")

    this.assert.equal(this.controller.namespacedEpsilonOutletDisconnectedCallCountValue, 0)
    this.assert.notOk(
      disconnectedEpsilon.classList.contains("disconnected"),
      `expected "${disconnectedEpsilon.className}" not to contain "disconnected"`
    )

    await this.remove(disconnectedEpsilon)

    this.assert.equal(this.controller.namespacedEpsilonOutletDisconnectedCallCountValue, 1)
    this.assert.ok(
      disconnectedEpsilon.classList.contains("disconnected"),
      `expected "${disconnectedEpsilon.className}" to contain "disconnected"`
    )
    this.assert.notOk(disconnectedEpsilon.isConnected, "element is not present in document")
  }

  async "test outlet disconnected callback when an outlet present in the document removes the selector attribute"() {
    const element = this.findElement("#alpha1")

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 0)
    this.assert.notOk(
      element.classList.contains("disconnected"),
      `expected "${element.className}" not to contain "disconnected"`
    )

    await this.removeAttribute(element, "id")

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 1)
    this.assert.ok(
      element.classList.contains("disconnected"),
      `expected "${element.className}" to contain "disconnected"`
    )
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test outlet disconnected callback when an outlet present in the document removes the data-controller attribute"() {
    const element = this.findElement("#alpha1")

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 0)
    this.assert.notOk(
      element.classList.contains("disconnected"),
      `expected "${element.className}" not to contain "disconnected"`
    )

    await this.removeAttribute(element, "data-controller")

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 1)
    this.assert.ok(
      element.classList.contains("disconnected"),
      `expected "${element.className}" to contain "disconnected"`
    )
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test outlet connect callback when the controlled element's outlet attribute is added"() {
    const gamma2 = this.findElement("#gamma2")

    await this.setAttribute(this.controller.element, `data-${this.identifier}-gamma-outlet`, "#gamma2")

    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 1)
    this.assert.ok(gamma2.isConnected, "#gamma2 is still present in document")
    this.assert.ok(gamma2.classList.contains("connected"), `expected "${gamma2.className}" to contain "connected"`)
  }

  async "test outlet connect callback doesn't get trigged when any attribute gets added to the controller element"() {
    this.assert.equal(this.controller.alphaOutletConnectedCallCountValue, 2)
    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 2)
    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 0)
    this.assert.equal(this.controller.namespacedEpsilonOutletConnectedCallCountValue, 2)

    await this.setAttribute(this.controller.element, "data-some-random-attribute", "#alpha1")

    this.assert.equal(this.controller.alphaOutletConnectedCallCountValue, 2)
    this.assert.equal(this.controller.betaOutletConnectedCallCountValue, 2)
    this.assert.equal(this.controller.gammaOutletConnectedCallCountValue, 0)
    this.assert.equal(this.controller.namespacedEpsilonOutletConnectedCallCountValue, 2)

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 0)
    this.assert.equal(this.controller.betaOutletDisconnectedCallCountValue, 0)
    this.assert.equal(this.controller.gammaOutletDisconnectedCallCountValue, 0)
    this.assert.equal(this.controller.namespacedEpsilonOutletDisconnectedCallCountValue, 0)
  }

  async "test outlet connect callback when the controlled element's outlet attribute is changed"() {
    const alpha1 = this.findElement("#alpha1")
    const alpha2 = this.findElement("#alpha2")

    await this.setAttribute(this.controller.element, `data-${this.identifier}-alpha-outlet`, "#alpha1")

    this.assert.equal(this.controller.alphaOutletConnectedCallCountValue, 2)
    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 1)
    this.assert.ok(alpha1.isConnected, "alpha1 is still present in document")
    this.assert.ok(alpha2.isConnected, "alpha2 is still present in document")
    this.assert.ok(alpha1.classList.contains("connected"), `expected "${alpha1.className}" to contain "connected"`)
    this.assert.notOk(
      alpha1.classList.contains("disconnected"),
      `expected "${alpha1.className}" to contain "disconnected"`
    )
    this.assert.ok(
      alpha2.classList.contains("disconnected"),
      `expected "${alpha2.className}" to contain "disconnected"`
    )
  }

  async "test outlet disconnected callback when the controlled element's outlet attribute is removed"() {
    const alpha1 = this.findElement("#alpha1")
    const alpha2 = this.findElement("#alpha2")

    await this.removeAttribute(this.controller.element, `data-${this.identifier}-alpha-outlet`)

    this.assert.equal(this.controller.alphaOutletDisconnectedCallCountValue, 2)
    this.assert.ok(alpha1.isConnected, "#alpha1 is still present in document")
    this.assert.ok(alpha2.isConnected, "#alpha2 is still present in document")
    this.assert.ok(
      alpha1.classList.contains("disconnected"),
      `expected "${alpha1.className}" to contain "disconnected"`
    )
    this.assert.ok(
      alpha2.classList.contains("disconnected"),
      `expected "${alpha2.className}" to contain "disconnected"`
    )
  }
}
