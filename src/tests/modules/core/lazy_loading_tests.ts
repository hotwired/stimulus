import { ApplicationTestCase } from "../../cases"
import { Controller } from "../../../core"
import { MockLogger } from "./error_handler_tests"

class LazyController extends Controller {
  connect() {
    this.application.logger.log("Hello from lazy controller")
  }
}

export default class LazyLoadingTests extends ApplicationTestCase {
  async setupApplication() {
    this.application.logger = new MockLogger()

    this.application.registerLazy("lazy", () => new Promise((resolve, _reject) => resolve(LazyController)))
  }

  get mockLogger(): MockLogger {
    return this.application.logger as any
  }

  async "test lazy loading of controllers"() {
    await this.renderFixture(`<div data-controller="lazy"></div><div data-controller="lazy"></div>`)

    this.assert.equal(this.mockLogger.logs.length, 2)
    this.mockLogger.logs.forEach((entry) => this.assert.equal(entry, "Hello from lazy controller"))
  }
}
