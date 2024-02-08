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

    const { message, warning, detail } = this.mockLogger.warns[0]

    this.assert.equal(
      message,
      'Warning: Element references undefined action "not-found" on controller with identifier "controller2"'
    )
    this.assert.equal(
      warning,
      'Stimulus is unable to connect the action "not-found" with an action on the controller "controller2". Please make sure the action references a valid method on the controller.'
    )
    this.assert.deepEqual(detail, {
      element: this.fixtureElement.children[0],
      identifier: "controller2",
      methodName: "not-found",
    })
  }

  async "test errors from elementMatchedNoValue being forwarded as warnings"() {
    await this.renderFixture(`<div data-controller="controller2" data-action="controller2#not-a-method"></div>`)

    this.assert.equal(this.mockLogger.warns.length, 1)
    this.assert.equal(this.mockLogger.warns[0].message, "Warning: missing event name")
    this.assert.equal(this.mockLogger.warns[0].warning, 'Warning connecting action "controller2#not-a-method"')
  }

  async "test unique warnings for actions referencing undefined controllers"() {
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
          message: 'Warning: Element references unknown action for non-registered controller "non-existing-controller"',
          warning:
            'Stimulus is unable to find a registered controller with identifier "non-existing-controller" that is referenced from action "non-existing-controller#found". The specified controller is not registered within the application. Please ensure that the controller with the identifier "non-existing-controller" is properly registered. For reference, the warning details include a list of all currently registered controller identifiers.',
        },
        {
          message: 'Warning: Element references unknown action for non-registered controller "non-existing-controller"',
          warning:
            'Stimulus is unable to find a registered controller with identifier "non-existing-controller" that is referenced from action "non-existing-controller#not-found". The specified controller is not registered within the application. Please ensure that the controller with the identifier "non-existing-controller" is properly registered. For reference, the warning details include a list of all currently registered controller identifiers.',
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
