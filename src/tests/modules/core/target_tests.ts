import { ControllerTestCase } from "../../cases/controller_test_case"
import { TargetController } from "../../controllers/target_controller"

export default class TargetTests extends ControllerTestCase(TargetController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}" data-${this.identifier}-connected-class="connected" data-${this.identifier}-disconnected-class="disconnected">
      <div data-${this.identifier}-target="alpha" id="alpha1"></div>
      <div data-${this.identifier}-target="alpha" id="alpha2"></div>
      <div data-${this.identifier}-target="beta" id="beta1">
        <div data-${this.identifier}-target="gamma" id="gamma1"></div>
      </div>
      <div data-controller="${this.identifier}" id="child">
        <div data-${this.identifier}-target="delta" id="delta1"></div>
      </div>
      <textarea data-${this.identifier}-target="omega input" id="input1"></textarea>
    </div>
  `

  "test TargetSet#find"() {
    this.assert.equal(this.controller.targets.find("alpha"), this.findElement("#alpha1"))
  }

  "test TargetSet#findAll"() {
    this.assert.deepEqual(
      this.controller.targets.findAll("alpha"),
      this.findElements("#alpha1", "#alpha2")
    )
  }

  "test TargetSet#findAll with multiple arguments"() {
    this.assert.deepEqual(
      this.controller.targets.findAll("alpha", "beta"),
      this.findElements("#alpha1", "#alpha2", "#beta1")
    )
  }

  "test TargetSet#has"() {
    this.assert.equal(this.controller.targets.has("gamma"), true)
    this.assert.equal(this.controller.targets.has("delta"), false)
  }

  "test TargetSet#find ignores child controller targets"() {
    this.assert.equal(this.controller.targets.find("delta"), null)
    this.findElement("#child").removeAttribute("data-controller")
    this.assert.equal(this.controller.targets.find("delta"), this.findElement("#delta1"))
  }

  "test linked target properties"() {
    this.assert.equal(this.controller.betaTarget, this.findElement("#beta1"))
    this.assert.deepEqual(this.controller.betaTargets, this.findElements("#beta1"))
    this.assert.equal(this.controller.hasBetaTarget, true)
  }

  "test inherited linked target properties"() {
    this.assert.equal(this.controller.alphaTarget, this.findElement("#alpha1"))
    this.assert.deepEqual(this.controller.alphaTargets, this.findElements("#alpha1", "#alpha2"))
  }

  "test singular linked target property throws an error when no target is found"() {
    this.findElement("#beta1").removeAttribute(`data-${this.identifier}-target`)
    this.assert.equal(this.controller.hasBetaTarget, false)
    this.assert.equal(this.controller.betaTargets.length, 0)
    this.assert.throws(() => this.controller.betaTarget)
  }

  "test target connected callback fires after initialize() and when calling connect()"() {
    const connectedInputs = this.controller.inputTargets.filter(target => target.classList.contains("connected"))

    this.assert.equal(connectedInputs.length, 1)
    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
  }

  async "test target connected callback when element is inserted"() {
    const connectedInput = document.createElement("input")
    connectedInput.setAttribute(`data-${this.controller.identifier}-target`, "input")

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)

    this.controller.element.appendChild(connectedInput)
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 2)
    this.assert.ok(connectedInput.classList.contains("connected"), `expected "${connectedInput.className}" to contain "connected"`)
    this.assert.ok(connectedInput.isConnected, "element is present in document")
  }

  async "test target connected callback when present element adds the target attribute"() {
    const element = this.findElement("#alpha1")

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)

    element.setAttribute(`data-${this.controller.identifier}-target`, "input")
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 2)
    this.assert.ok(element.classList.contains("connected"), `expected "${element.className}" to contain "connected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test target connected callback when element adds a token to an existing target attribute"() {
    const element = this.findElement("#alpha1")

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)

    element.setAttribute(`data-${this.controller.identifier}-target`, "alpha input")
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 2)
    this.assert.ok(element.classList.contains("connected"), `expected "${element.className}" to contain "connected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test target disconnected callback fires when calling disconnect() on the controller"() {
    this.assert.equal(this.controller.inputTargets.filter(target => target.classList.contains("disconnected")).length, 0)
    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 0)

    this.controller.context.disconnect()
    await this.nextFrame

    this.assert.equal(this.controller.inputTargets.filter(target => target.classList.contains("disconnected")).length, 1)
    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
  }

  async "test target disconnected callback when element is removed"() {
    const disconnectedInput = this.findElement("#input1")

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 0)
    this.assert.notOk(disconnectedInput.classList.contains("disconnected"), `expected "${disconnectedInput.className}" not to contain "disconnected"`)

    disconnectedInput.parentElement?.removeChild(disconnectedInput)
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
    this.assert.ok(disconnectedInput.classList.contains("disconnected"), `expected "${disconnectedInput.className}" to contain "disconnected"`)
    this.assert.notOk(disconnectedInput.isConnected, "element is not present in document")
  }

  async "test target disconnected callback when an element present in the document removes the target attribute"() {
    const element = this.findElement("#input1")

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 0)
    this.assert.notOk(element.classList.contains("disconnected"), `expected "${element.className}" not to contain "disconnected"`)

    element.removeAttribute(`data-${this.controller.identifier}-target`)
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
    this.assert.ok(element.classList.contains("disconnected"), `expected "${element.className}" to contain "disconnected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test target disconnected(), then connected() callback fired when the target name is present after the attribute change"() {
    const element = this.findElement("#input1")

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 0)
    this.assert.notOk(element.classList.contains("disconnected"), `expected "${element.className}" not to contain "disconnected"`)

    element.setAttribute(`data-${this.controller.identifier}-target`, "input")
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 2)
    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
    this.assert.ok(element.classList.contains("disconnected"), `expected "${element.className}" to contain "disconnected"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test [target]Connected() and [target]Disconnected() do not loop infinitely"() {
    this.controller.element.insertAdjacentHTML("beforeend", `
      <div data-${this.identifier}-target="recursive" id="recursive2"></div>
    `)
    await this.nextFrame

    this.assert.ok(!!this.fixtureElement.querySelector("#recursive2"))
    this.assert.equal(this.controller.recursiveTargetConnectedCallCountValue, 1)
    this.assert.equal(this.controller.recursiveTargetDisconnectedCallCountValue, 0)
  }
}
