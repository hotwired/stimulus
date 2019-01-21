import { Application } from "../../application"
import { DOMTestCase } from "@stimulus/test"
import { Schema, defaultSchema } from "../../schema"

class TestApplication extends Application {
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
      await super.runTest(testName)
    } finally {
      this.application.stop()
    }
  }

  setupApplication() {
    // Override in subclasses to register controllers
  }
}
