import { LogControllerTestCase } from "../log_controller_test_case"

export default class extends LogControllerTestCase {
  fixtureHTML = `
    <div data-controller="${this.identifier}">
      <div data-target="${this.identifier}.alpha" id="alpha1"></div>
      <div data-target="${this.identifier}.alpha" id="alpha2"></div>
      <div data-target="${this.identifier}.beta" id="beta1">
        <div data-target="${this.identifier}.gamma" id="gamma1"></div>
      </div>
      <div data-controller="${this.identifier}" id="child">
        <div data-target="${this.identifier}.delta" id="delta1"></div>
      </div>
    </div>
  `

  "test TargetSet#find"() {
    this.assert.equal(this.findElement("#alpha1"), this.controller.targets.find("alpha"))
  }

  "test TargetSet#findAll"() {
    this.assert.deepEqual(
      this.findElements("#alpha1", "#alpha2"),
      this.controller.targets.findAll("alpha")
    )
  }

  "test TargetSet#findAll with multiple arguments"() {
    this.assert.deepEqual(
      this.findElements("#alpha1", "#alpha2", "#beta1"),
      this.controller.targets.findAll("alpha", "beta")
    )
  }

  "test TargetSet#has"() {
    this.assert.equal(true, this.controller.targets.has("gamma"))
    this.assert.equal(false, this.controller.targets.has("delta"))
  }

  "test TargetSet#find ignores child controller targets"() {
    this.assert.equal(null, this.controller.targets.find("delta"))
    this.findElement("#child").removeAttribute("data-controller")
    this.assert.equal(this.findElement("#delta1"), this.controller.targets.find("delta"))
  }
}
