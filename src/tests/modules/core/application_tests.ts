import { ApplicationTestCase } from "../../cases/application_test_case"
import { LogController } from "../../controllers/log_controller"

class AController extends LogController {}
class BController extends LogController {}
class CController extends LogController {}
class DController extends LogController {
  static get shouldLoad(){
    return false
  }
}

export default class ApplicationTests extends ApplicationTestCase {
  fixtureHTML = `<div data-controller="a"><div data-controller="b">`
  private definitions = [
    { controllerConstructor: AController, identifier: "a" },
    { controllerConstructor: BController, identifier: "b" }
  ]

  async "test Application#register"() {
    this.assert.equal(this.controllers.length, 0)
    this.application.register("log", LogController)
    await this.renderFixture(`<div data-controller="log">`)

    this.assert.equal(this.controllers[0].initializeCount, 1)
    this.assert.equal(this.controllers[0].connectCount, 1)
  }

  "test Application#load"() {
    this.assert.equal(this.controllers.length, 0)
    this.application.load(this.definitions)
    this.assert.equal(this.controllers.length, 2)

    this.assert.ok(this.controllers[0] instanceof AController)
    this.assert.equal(this.controllers[0].initializeCount, 1)
    this.assert.equal(this.controllers[0].connectCount, 1)

    this.assert.ok(this.controllers[1] instanceof BController)
    this.assert.equal(this.controllers[1].initializeCount, 1)
    this.assert.equal(this.controllers[1].connectCount, 1)
  }

  "test Application#unload"() {
    this.application.load(this.definitions)
    const originalControllers = this.controllers

    this.application.unload("a")
    this.assert.equal(originalControllers[0].disconnectCount, 1)

    this.assert.equal(this.controllers.length, 1)
    this.assert.ok(this.controllers[0] instanceof BController)
  }

  "test reloading an already-loaded module"() {
    this.application.load(this.definitions)
    const originalControllers = this.controllers

    this.application.load({ controllerConstructor: CController, identifier: "a" })
    this.assert.equal(this.controllers.length, 2)
    this.assert.equal(originalControllers[0].disconnectCount, 1)

    this.assert.notEqual(originalControllers[0], this.controllers[1])
    this.assert.ok(this.controllers[1] instanceof CController)
    this.assert.equal(this.controllers[1].initializeCount, 1)
    this.assert.equal(this.controllers[1].connectCount, 1)
  }

  "test no loading of module with false shouldLoad"() {
    this.application.load(this.definitions)

    this.assert.equal(this.controllers.length, 2)
    this.application.load({ controllerConstructor: DController, identifier: "d" })
    this.assert.equal(this.controllers.length, 2)
  }

  get controllers() {
    return this.application.controllers as LogController[]
  }
}
