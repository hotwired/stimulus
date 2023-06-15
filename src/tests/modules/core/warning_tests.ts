import { ApplicationTestCase } from "../../cases"
import { Controller } from "../../../core"

class WarningController extends Controller {
  found() {}
}

class MockLogger {
  errors: any[] = []
  logs: any[] = []
  warns: any[] = []

  log(event: any) {
    this.logs.push(event)
  }

  error(event: any) {
    this.errors.push(event)
  }

  warn(event: any, message: string, warning: string, detail: string) {
    this.warns.push({ message, warning, detail })
  }

  groupCollapsed() {}
  groupEnd() {}
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

  async "test warnings for undefined controllers"() {
    await this.setAttribute(this.fixtureElement, "data-controller", "controller1 unknown")

    this.assert.equal(this.mockLogger.warns.length, 1)

    const { message, warning, detail } = this.mockLogger.warns[0]

    this.assert.equal(message, 'Warning connecting controller "unknown"')
    this.assert.equal(warning, 'Element references undefined controller "unknown"')
    this.assert.deepEqual(detail, { element: this.fixtureElement, identifier: "unknown" })
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
    await this.renderFixture(`<a data-controller="controller1 controller2"></a><a data-action="non-existing-controller#found" data-controller="controller1 controller2"></a>`)

    console.log(this.mockLogger.warns.map((warn) => warn.message))

    this.assert.equal(this.mockLogger.warns.length, 1)
  }

  get mockLogger(): MockLogger {
    return this.application.logger as any
  }

  async "test no warnings for found actions"() {
    await this.renderFixture(
      `<a data-controller="controller1 controller2" data-action="controller1#found controller2#found"></a>`
    )

    this.assert.equal(this.mockLogger.warns.length, 0)
  }

  async "test case from comments"() {
    await this.renderFixture(`<div data-controller="controller1 controller2" data-action="click->controller1#found click->controller2#found">`)

    console.log(this.mockLogger.warns)

    this.assert.equal(this.mockLogger.warns.length, 0)
  }
}
