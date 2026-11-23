import { ApplicationTestCase } from "../../cases/application_test_case"
import { Controller } from "../../../core/controller"

class ChildController extends Controller {
  static disconnectCount = 0

  disconnect() {
    ChildController.disconnectCount++
  }
}

class SingularParentController extends Controller {
  static outlets = ["child"]
  childOutlet!: Controller

  connect() {
    this.childOutlet
  }
}

class PluralParentController extends Controller {
  static outlets = ["child"]
  childOutlets!: Controller[]

  connect() {
    this.childOutlets
  }
}

export default class OutletConnectTests extends ApplicationTestCase {
  fixtureHTML = `
    <div id="singular" data-controller="singular" data-singular-child-outlet="#child-1"></div>
    <div id="plural" data-controller="plural" data-plural-child-outlet=".child"></div>
    <div id="child-1" class="child" data-controller="child"></div>
    <div id="child-2" class="child" data-controller="child"></div>
  `

  setupApplication() {
    ChildController.disconnectCount = 0
    this.application.register("singular", SingularParentController)
    this.application.register("plural", PluralParentController)
    this.application.register("child", ChildController)
  }

  childController(selector: string) {
    return this.application.getControllerForElementAndIdentifier(this.findElement(selector), "child")
  }

  async "test an outlet read in connect() before it connects disconnects when its controller attribute is removed"() {
    this.assert.ok(this.childController("#child-1"))

    await this.removeAttribute("#child-1", "data-controller")

    this.assert.equal(this.childController("#child-1"), null)
    this.assert.equal(ChildController.disconnectCount, 1)
  }

  async "test outlets read in connect() before they connect disconnect when their elements are removed"() {
    const child1 = this.findElement("#child-1")
    const child2 = this.findElement("#child-2")

    await this.remove(child1)
    await this.remove(child2)

    this.assert.equal(this.application.getControllerForElementAndIdentifier(child1, "child"), null)
    this.assert.equal(this.application.getControllerForElementAndIdentifier(child2, "child"), null)
    this.assert.equal(ChildController.disconnectCount, 2)
  }
}
