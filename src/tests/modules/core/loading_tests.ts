import { ApplicationTestCase } from "../../cases/application_test_case"
import { LogController } from "../../controllers/log_controller"

class UnloadableController extends LogController {
  static get shouldLoad() {
    return false
  }
}
class LoadableController extends LogController {
  static get shouldLoad() {
    return true
  }
}

class AfterLoadController extends LogController {
  static values = {
    example: { default: "demo", type: String },
  }

  static afterLoad(identifier: string, application: any) {
    const newElement = document.createElement("div")
    newElement.classList.add("after-load-test")
    newElement.setAttribute(application.schema.controllerAttribute, identifier)
    application.element.append(newElement)
    document.dispatchEvent(
      new CustomEvent("test", {
        detail: { identifier, application, exampleDefault: this.values.example.default, controller: this },
      })
    )
  }
}

export default class ApplicationTests extends ApplicationTestCase {
  fixtureHTML = `<div data-controller="loadable"><div data-controller="unloadable">`

  "test module with false shouldLoad should not load when registering"() {
    this.application.register("unloadable", UnloadableController)
    this.assert.equal(this.controllers.length, 0)
  }

  "test module with true shouldLoad should load when registering"() {
    this.application.register("loadable", LoadableController)
    this.assert.equal(this.controllers.length, 1)
  }

  "test module with afterLoad method should be triggered when registered"() {
    // set up an event listener to track the params passed into the AfterLoadController
    let data: { application?: any; identifier?: string; exampleDefault?: string; controller?: any } = {}
    document.addEventListener("test", (({ detail }: CustomEvent) => {
      data = detail
    }) as EventListener)

    this.assert.equal(data.application, undefined)
    this.assert.equal(data.controller, undefined)
    this.assert.equal(data.exampleDefault, undefined)
    this.assert.equal(data.identifier, undefined)

    this.application.register("after-load", AfterLoadController)

    // check the DOM element has been added based on params provided
    this.assert.equal(this.findElements('[data-controller="after-load"]').length, 1)

    // check that static method was correctly called with the params
    this.assert.equal(data.application, this.application)
    this.assert.equal(data.controller, AfterLoadController)
    this.assert.equal(data.exampleDefault, "demo")
    this.assert.equal(data.identifier, "after-load")
  }

  get controllers() {
    return this.application.controllers as LogController[]
  }
}
