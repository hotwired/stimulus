import { ControllerTestCase } from "../../cases/controller_test_case"
import { TargetController } from "../../controllers/target_controller"

export default class LegacyTargetTests extends ControllerTestCase(TargetController) {
  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <div data-target="${this.identifier}.alpha" id="alpha1"></div>
      <div data-target="${this.identifier}.alpha" id="alpha2"></div>
      <div data-target="${this.identifier}.beta" data-${this.identifier}-target="gamma" id="beta1">
        <div data-target="${this.identifier}.gamma" id="gamma1"></div>
      </div>
      <div data-controller="${this.identifier}" id="child">
        <div data-target="${this.identifier}.delta" id="delta1"></div>
      </div>
      <textarea data-target="${this.identifier}.input" id="input1"></textarea>
    </div>
  `

  warningCount = 0

  async setupApplication() {
    await super.setupApplication()
    this.application.logger = Object.create(console, {
      warn: {
        value: (message: string, ...args: any[]) => this.warningCount++
      }
    })
  }

  "test TargetSet#find"() {
    this.assert.equal(this.controller.targets.find("alpha"), this.findElement("#alpha1"))
    this.assert.equal(this.warningCount, 1)
  }

  "test TargetSet#find prefers scoped target attributes"() {
    this.assert.equal(this.controller.targets.find("gamma"), this.findElement("#beta1"))
    this.assert.equal(this.warningCount, 0)
  }

  "test TargetSet#findAll"() {
    this.assert.deepEqual(
      this.controller.targets.findAll("alpha"),
      this.findElements("#alpha1", "#alpha2")
    )
    this.assert.equal(this.warningCount, 2)
  }

  "test TargetSet#findAll prioritizes scoped target attributes"() {
    this.assert.deepEqual(
      this.controller.targets.findAll("gamma"),
      this.findElements("#beta1", "#gamma1")
    )
    this.assert.equal(this.warningCount, 1)
  }

  "test TargetSet#findAll with multiple arguments"() {
    this.assert.deepEqual(
      this.controller.targets.findAll("alpha", "beta"),
      this.findElements("#alpha1", "#alpha2", "#beta1")
    )
    this.assert.equal(this.warningCount, 3)
  }

  "test TargetSet#has"() {
    this.assert.equal(this.controller.targets.has("gamma"), true)
    this.assert.equal(this.controller.targets.has("delta"), false)
    this.assert.equal(this.warningCount, 0)
  }

  "test TargetSet#find ignores child controller targets"() {
    this.assert.equal(this.controller.targets.find("delta"), null)
    this.findElement("#child").removeAttribute("data-controller")
    this.assert.equal(this.controller.targets.find("delta"), this.findElement("#delta1"))
    this.assert.equal(this.warningCount, 1)
  }

  "test linked target properties"() {
    this.assert.equal(this.controller.betaTarget, this.findElement("#beta1"))
    this.assert.deepEqual(this.controller.betaTargets, this.findElements("#beta1"))
    this.assert.equal(this.controller.hasBetaTarget, true)
    this.assert.equal(this.warningCount, 1)
  }

  "test inherited linked target properties"() {
    this.assert.equal(this.controller.alphaTarget, this.findElement("#alpha1"))
    this.assert.deepEqual(this.controller.alphaTargets, this.findElements("#alpha1", "#alpha2"))
    this.assert.equal(this.warningCount, 2)
  }

  "test singular linked target property throws an error when no target is found"() {
    this.findElement("#beta1").removeAttribute("data-target")
    this.assert.equal(this.controller.hasBetaTarget, false)
    this.assert.equal(this.controller.betaTargets.length, 0)
    this.assert.throws(() => this.controller.betaTarget)
  }
}
