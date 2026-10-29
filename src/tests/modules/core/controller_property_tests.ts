import { Controller } from "../../../core/controller"
import { ApplicationTestCase } from "../../cases/application_test_case"

class MockLogger {
  warns: any[][] = []

  log() {}
  error() {}

  warn(...args: any[]) {
    this.warns.push(args)
  }

  groupCollapsed() {}
  groupEnd() {}
}

class ScopeController extends Controller {
  // The section the controller lives in: a natural name that replaces the
  // `scope` getter every other Controller property reads through
  get scope(): any {
    return document.querySelector("section")
  }
}

class ElementAndDataController extends Controller {
  get element(): any {
    return document.body
  }

  get data(): any {
    return {}
  }
}

class InheritedScopeController extends ScopeController {}

class PlainController extends Controller {
  static targets = ["name"]
  static values = { count: Number }

  get section() {
    return this.element.closest("section")
  }
}

export default class ControllerPropertyTests extends ApplicationTestCase {
  fixtureHTML = `<section><div data-controller="scope element-and-data inherited plain"></div></section>`
  logger = new MockLogger()

  setupApplication() {
    this.application.logger = this.logger
  }

  "test registering a controller that overrides a Controller property warns, naming both"() {
    this.application.register("scope", ScopeController)

    this.assert.equal(this.logger.warns.length, 1)
    this.assert.equal(
      this.logger.warns[0][0],
      `The "scope" controller overrides "scope", a property Stimulus defines on Controller and reads itself. Rename it to keep the controller working.`
    )
    this.assert.equal(this.logger.warns[0][1], ScopeController)
  }

  "test each overridden Controller property is named"() {
    this.application.register("element-and-data", ElementAndDataController)

    this.assert.deepEqual(
      this.logger.warns.map((args) => args[0]),
      [
        `The "element-and-data" controller overrides "element", a property Stimulus defines on Controller and reads itself. Rename it to keep the controller working.`,
        `The "element-and-data" controller overrides "data", a property Stimulus defines on Controller and reads itself. Rename it to keep the controller working.`,
      ]
    )
  }

  "test a property overridden by a parent class is found"() {
    this.application.register("inherited", InheritedScopeController)

    this.assert.equal(this.logger.warns.length, 1)
    this.assert.equal(this.logger.warns[0][1], InheritedScopeController)
  }

  "test registering a controller with its own targets, values and properties does not warn"() {
    this.application.register("plain", PlainController)

    this.assert.deepEqual(this.logger.warns, [])
  }
}
