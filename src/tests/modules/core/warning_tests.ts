import { ApplicationTestCase } from "../../cases"
import { Controller } from "../../../core"
import { MockLogger } from "./error_handler_tests"

class WarningController extends Controller {
  found() {}
}

export default class WarningTests extends ApplicationTestCase {
  async setupApplication() {
    const logger = new MockLogger()

    this.application.warnings = true
    this.application.logger = logger

    const identifiers: string[] = ["controller1", "controller2"]

    identifiers.forEach((identifier) => {
      this.application.register(identifier, WarningController)
    })
  }

  get mockLogger(): MockLogger {
    return this.application.logger as any
  }

  async "test warnings for undefined controllers"() {
    await this.setAttribute(this.fixtureElement, "data-controller", "controller1 unknown")

    this.assert.equal(this.mockLogger.warns.length, 1)

    const { message, warning, detail } = this.mockLogger.warns[0]

    this.assert.equal(message, 'Warning: Element references an unregistered controller identifier "unknown".')
    this.assert.equal(
      warning,
      'Stimulus is unable to connect the controller with identifier "unknown". The specified controller is not registered within the application. Please ensure that the controller with the identifier "unknown" is properly registered. For reference, the warning details include a list of all currently registered controller identifiers.'
    )
    this.assert.deepEqual(detail, {
      element: this.fixtureElement,
      identifier: "unknown",
      registeredIdentifiers: ["controller1", "controller2"],
    })
  }

  async "test no warnings for found controllers"() {
    await this.setAttribute(this.fixtureElement, "data-controller", "controller1 controller2")

    this.assert.equal(this.mockLogger.warns.length, 0)
  }

  async "test warnings for undefined actions"() {
    await this.renderFixture(
      `<a data-controller="controller1 controller2" data-action="click->controller2#not-found"></a>`
    )

    this.assert.equal(this.mockLogger.warns.length, 1)

    const { message, warning } = this.mockLogger.warns[0]

    this.assert.equal(message, 'Warning connecting action "click->controller2#not-found"')
    this.assert.equal(
      warning,
      'Action "click->controller2#not-found" references undefined method "not-found" on controller "controller2"'
    )
    // this.assert.deepEqual(detail, { element: this.fixtureElement, identifier: "unknown" })
  }

  async "test warnings for actions referencing undefined controllers"() {
    await this.renderFixture(
      `<a data-controller="controller1 controller2"></a><a data-action="non-existing-controller#found" data-controller="controller1 controller2"></a><a data-controller="controller1" data-action="non-existing-controller#not-found"></a>`
    )

    this.assert.equal(this.mockLogger.warns.length, 2)

    this.assert.deepEqual(
      this.mockLogger.warns
        .map((warn) => ({ message: warn.message, warning: warn.warning }))
        .sort((warn) => warn.warning),
      [
        {
          warning:
            'Warning connecting "non-existing-controller#found" to undefined controller "non-existing-controller"',
          message:
            'Warning connecting "non-existing-controller#found" to undefined controller "non-existing-controller"',
        },
        {
          warning:
            'Warning connecting "non-existing-controller#not-found" to undefined controller "non-existing-controller"',
          message:
            'Warning connecting "non-existing-controller#not-found" to undefined controller "non-existing-controller"',
        },
      ]
    )
  }

  async "test no warnings for found actions"() {
    await this.renderFixture(
      `<a data-controller="controller1 controller2" data-action="controller1#found controller2#found"></a>`
    )

    this.assert.equal(this.mockLogger.warns.length, 0)
  }
}
