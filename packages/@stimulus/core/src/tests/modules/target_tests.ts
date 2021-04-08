import { ControllerTestCase } from "../cases/controller_test_case"
import { TargetController } from "../controllers/target_controller"

export default class TargetTests extends ControllerTestCase(TargetController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}" data-${this.identifier}-added-class="added" data-${this.identifier}-removed-class="removed">
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

  "test target added callback fires after connect()"() {
    const addedInputs = this.controller.inputTargets.filter(target => target.classList.contains("added"))

    this.assert.equal(addedInputs.length, 0)
    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 0)
  }

  async "test target added callback when element is inserted"() {
    const addedInput = document.createElement("input")
    addedInput.setAttribute(`data-${this.controller.identifier}-target`, "input")

    this.controller.element.appendChild(addedInput)
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
    this.assert.ok(addedInput.classList.contains("added"), `expected "${addedInput.className}" to contain "added"`)
    this.assert.ok(addedInput.isConnected, "element is present in document")
  }

  async "test target added callback when present element adds the target attribute"() {
    const element = this.findElement("#child")

    element.setAttribute(`data-${this.controller.identifier}-target`, "input")
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
    this.assert.ok(element.classList.contains("added"), `expected "${element.className}" to contain "added"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test target added callback when present element adds a token to an existing target attribute"() {
    const element = this.findElement("#alpha1")

    element.setAttribute(`data-${this.controller.identifier}-target`, "alpha input")
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetConnectedCallCountValue, 1)
    this.assert.ok(element.classList.contains("added"), `expected "${element.className}" to contain "added"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test target remove callback fires before disconnect()"() {
    const inputs = this.controller.inputTargets

    this.controller.disconnect()
    await this.nextFrame

    const removedInputs = inputs.filter(target => target.classList.contains("removed"))

    this.assert.equal(removedInputs.length, 0)
    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 0)
  }

  async "test target removed callback when element is removed"() {
    const removedInput = this.findElement("#input1")

    removedInput.remove()
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
    this.assert.ok(removedInput.classList.contains("removed"), `expected "${removedInput.className}" to contain "removed"`)
    this.assert.notOk(removedInput.isConnected, "element is not present in document")
  }

  async "test target removed callback when an element present in the document removes the target attribute"() {
    const element = this.findElement("#input1")

    element.removeAttribute(`data-${this.controller.identifier}-target`)
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 1)
    this.assert.ok(element.classList.contains("removed"), `expected "${element.className}" to contain "removed"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }

  async "test target removed callback does not fire when the target name is present after the attribute change"() {
    const element = this.findElement("#input1")

    element.setAttribute(`data-${this.controller.identifier}-target`, "input")
    await this.nextFrame

    this.assert.equal(this.controller.inputTargetDisconnectedCallCountValue, 0)
    this.assert.notOk(element.classList.contains("removed"), `expected "${element.className}" not to contain "removed"`)
    this.assert.ok(element.isConnected, "element is still present in document")
  }
}
