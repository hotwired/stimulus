import { ApplicationTestCase } from "../../cases/application_test_case"
import { LogController } from "../../controllers/log_controller"

class UnloadableController extends LogController {
  static get shouldLoad(){
    return false
  }
}
class LoadableController extends LogController {
  static get shouldLoad(){
    return true
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

  get controllers() {
    return this.application.controllers as LogController[]
  }
}
