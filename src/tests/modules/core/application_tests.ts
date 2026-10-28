import { ApplicationTestCase } from "../../cases/application_test_case"
import { LogController } from "../../controllers/log_controller"

class AController extends LogController {}
class BController extends LogController {}

class ScopeOverridingController extends LogController {
  get scope(): any {
    return this.element.closest("section")
  }
}
class InheritedScopeOverridingController extends ScopeOverridingController {}
class UnloadedScopeOverridingController extends ScopeOverridingController {
  static get shouldLoad() {
    return false
  }
}
class ForeignController {
  static shouldLoad = true
  constructor(readonly context: any) {}
  get scope() {
    return this.context.scope
  }
  get element() {
    return this.scope.element
  }
  initialize() {}
  connect() {}
  disconnect() {}
}

export default class ApplicationTests extends ApplicationTestCase {
  fixtureHTML = `<div data-controller="a"><div data-controller="b">`
  private definitions = [
    { controllerConstructor: AController, identifier: "a" },
    { controllerConstructor: BController, identifier: "b" },
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

  "test Application#register warns about a controller overriding a reserved property"() {
    const warnings = this.captureWarnings()

    this.application.register("scoped", ScopeOverridingController)
    this.application.register("inherited", InheritedScopeOverridingController)

    this.assert.equal(warnings.length, 2)
    this.assert.ok(warnings[0].includes(`"scoped" controller defines "scope"`))
    this.assert.ok(warnings[1].includes(`"inherited" controller defines "scope"`))
  }

  "test Application#register does not warn about a controller using only its own property names"() {
    const warnings = this.captureWarnings()

    this.application.load(this.definitions)

    this.assert.equal(warnings.length, 0)
  }

  "test Application#register does not warn about a controller that does not load"() {
    const warnings = this.captureWarnings()

    this.application.register("unloaded", UnloadedScopeOverridingController)

    this.assert.equal(warnings.length, 0)
  }

  "test Application#register does not report the properties of another copy of Controller"() {
    const warnings = this.captureWarnings()

    this.application.register("foreign", ForeignController as any)

    this.assert.equal(warnings.length, 0)
  }

  private captureWarnings() {
    const warnings: string[] = []
    this.application.logger = { ...console, warn: (message: string) => warnings.push(message) }
    return warnings
  }

  get controllers() {
    return this.application.controllers as LogController[]
  }
}
