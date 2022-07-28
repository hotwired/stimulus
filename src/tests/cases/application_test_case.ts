import { Application } from "../../core/application";
import { DOMTestCase } from "./dom_test_case";
import { Schema, defaultSchema } from "../../core/schema";

class TestApplication extends Application {
  handleError(error: Error, message: string, detail: object) {
    throw error
  }
}

export class ApplicationTestCase extends DOMTestCase {
  schema: Schema = defaultSchema
  application!: Application

  async runTest(testName: string) {
    try {
      this.application = new TestApplication(this.fixtureElement, this.schema)
      this.setupApplication()
      this.application.start()
      await super.runTest(testName)
    } finally {
      this.application.stop()
    }
  }

  setupApplication() {
    // Override in subclasses to register controllers
  }
}
