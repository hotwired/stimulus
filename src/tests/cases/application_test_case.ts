import { Application } from "../../core/application";
import { DOMTestCase } from "./dom_test_case";
import { Schema, defaultSchema } from "../../core/schema";

export class TestApplication extends Application {
  handleError(error: Error, message: string, detail: object) {
    throw error
  }
}

export class ApplicationTestCase extends DOMTestCase {
  schema: Schema = defaultSchema
  application: Application = new TestApplication(this.fixtureElement, this.schema)

  async runTest(testName: string) {
    try {
      this.setupApplication()
      this.application.start()
      this.application.warnings = false
      await super.runTest(testName)
    } finally {
      this.application.stop()
    }
  }

  setupApplication() {
    // Override in subclasses to register controllers
  }
}
