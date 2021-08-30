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

class ErrorWhileConnectingController extends Controller {
  connect() {
    throw new Error('bad!');
  }
}

class TestApplicationWithDefaultErrorBehavior extends Application {
}

export default class ErrorHandlerTests extends ControllerTestCase(ErrorWhileConnectingController) {
  controllerConstructor = ErrorWhileConnectingController

  async setupApplication() {
    const logger = new MockLogger()

    this.application = new TestApplicationWithDefaultErrorBehavior(this.fixtureElement, this.schema)
    this.application.logger = logger

    window.onerror = function(message, source, lineno, colno, error) {
      logger.log(`error from window.onerror. message = ${message}, source = ${source}, lineno = ${lineno}, colno = ${colno}`)
    }

    await super.setupApplication()
  }

  async "test errors in connect are thrown and handled by built in logger"() {
    const mockLogger: any = this.application.logger

    // when `ErrorWhileConnectingController#connect` throws, the controller's application's logger's `error` function
    // is called; in this case that's `MockLogger#error`.
    this.assert.equal(1, mockLogger.errors.length)
  }

  async "test errors in connect are thrown and handled by window.onerror"() {
    const mockLogger: any = this.application.logger

    this.assert.equal(1, mockLogger.logs.length)
    this.assert.equal('error from window.onerror. message = Error connecting controller, source = , lineno = 0, colno = 0', mockLogger.logs[0])
  }
}
