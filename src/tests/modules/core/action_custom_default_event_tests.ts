import { TestApplication } from "../../cases/application_test_case"
import { LogControllerTestCase } from "../../cases/log_controller_test_case"
import { Schema, defaultSchema } from "../../../core/schema"
import { Application } from "../../../core/application"

export default class ActionKeyboardFilterTests extends LogControllerTestCase {
  schema: Schema = {
    ...defaultSchema,
    defaultEventNames: { ...defaultSchema.defaultEventNames, "some-element": () => "click" },
  }
  application: Application = new TestApplication(this.fixtureElement, this.schema)

  identifier = "c"
  fixtureHTML = `<some-element data-controller="c" data-action="c#log"></some-element>`

  async "test default event"() {
    await this.triggerEvent("some-element", "click")
    this.assertActions({ name: "log", eventType: "click" })
  }
}
