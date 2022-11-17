import { Application } from "../../../core/application"
import { DOMTestCase } from "../../cases/dom_test_case"
import { ActionDescriptorFilter } from "src/core/action_descriptor"

const mockCallback: { (label: string): void; lastCall: string | null } = (label: string) => {
  mockCallback.lastCall = label
}
mockCallback.lastCall = null

class TestApplicationWithCustomBehavior extends Application {
  registerActionOption(name: string, filter: ActionDescriptorFilter): void {
    mockCallback(`registerActionOption:${name}`)
    super.registerActionOption(name, filter)
  }
}

export default class ExtendingApplicationTests extends DOMTestCase {
  application!: Application

  async runTest(testName: string) {
    try {
      // use the documented way to start & reference only the returned application instance
      this.application = TestApplicationWithCustomBehavior.start(this.fixtureElement)
      await super.runTest(testName)
    } finally {
      this.application.stop()
    }
  }

  async setup() {
    mockCallback.lastCall = null
  }

  async teardown() {
    mockCallback.lastCall = null
  }

  async "test extended class method is supported when using MyApplication.start()"() {
    this.assert.equal(mockCallback.lastCall, null)

    const mockTrue = () => true
    this.application.registerActionOption("kbd", mockTrue)
    this.assert.equal(this.application.actionDescriptorFilters["kbd"], mockTrue)
    this.assert.equal(mockCallback.lastCall, "registerActionOption:kbd")

    const mockFalse = () => false
    this.application.registerActionOption("xyz", mockFalse)
    this.assert.equal(this.application.actionDescriptorFilters["xyz"], mockFalse)
    this.assert.equal(mockCallback.lastCall, "registerActionOption:xyz")
  }
}
