import { Controller } from "../../../core/controller"
import { Application } from "../../../core/application"
import { ControllerTestCase } from "../../cases/controller_test_case"

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

  warn(event: any) {
    this.warns.push(event)
  }

  groupCollapsed() {}
  groupEnd() {}
}

class ErrorWhileChangingValueController extends Controller {
  static values = { closed: Boolean }

  closedValueChanged() {
    throw new Error("bad value change!")
  }
}

class TestApplicationWithDefaultErrorBehavior extends Application {}

export default class ErrorHandlerValueTests extends ControllerTestCase(ErrorWhileChangingValueController) {
  controllerConstructor = ErrorWhileChangingValueController
  fixtureHTML = `<div data-controller="test" data-test-closed-value="true"></div>`

  async setupApplication() {
    const logger = new MockLogger()

    this.application = new TestApplicationWithDefaultErrorBehavior(this.fixtureElement, this.schema)
    this.application.logger = logger

    window.onerror = function (message, source, lineno, colno, _error) {
      logger.log(
        `error from window.onerror. message = ${message}, source = ${source}, lineno = ${lineno}, colno = ${colno}`
      )
    }

    super.setupApplication()
  }

  async "test errors in value changed callbacks are handled by built in logger"() {
    const mockLogger: any = this.application.logger

    this.assert.equal(1, mockLogger.errors.length)
  }

  async "test errors in value changed callbacks are handled by window.onerror"() {
    const mockLogger: any = this.application.logger

    this.assert.equal(1, mockLogger.logs.length)
    this.assert.equal(
      'error from window.onerror. message = Error invoking "closedValueChanged", source = , lineno = 0, colno = 0',
      mockLogger.logs[0]
    )
  }
}
