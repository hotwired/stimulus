import { Application } from "../../../core/application"
import { Controller } from "../../../core/controller"
import { ApplicationTestCase } from "../../cases/application_test_case"

type HandledError = { error: Error; message: string; detail: any }

class CollectingApplication extends Application {
  handled: HandledError[] = []

  handleError(error: Error, message: string, detail: object) {
    this.handled.push({ error, message, detail })
  }
}

const log: string[] = []

class TargetsController extends Controller {
  static targets = ["item"]

  connect() {
    log.push(`connect ${this.element.id}`)
  }

  clicked() {
    log.push(`click ${this.element.id}`)
  }

  itemTargetConnected(element: Element) {
    log.push(`connected ${element.id}`)
    if (element.hasAttribute("data-throw")) throw new Error(`connected ${element.id}`)
  }

  itemTargetDisconnected(element: Element) {
    log.push(`disconnected ${element.id}`)
    throw new Error(`disconnected ${element.id}`)
  }
}

class ValuesController extends Controller {
  static values = { count: Number, config: Object }

  connect() {
    log.push(`connect ${this.element.id}`)
  }

  countValueChanged(value: number) {
    if (value) throw new Error(`count ${value}`)
  }

  configValueChanged() {}
}

class OutletsController extends Controller {
  static outlets = ["item"]

  itemOutletConnected(_outlet: Controller, element: Element) {
    throw new Error(`outlet connected ${element.id}`)
  }

  itemOutletDisconnected(_outlet: Controller, element: Element) {
    throw new Error(`outlet disconnected ${element.id}`)
  }
}

export default class ErrorHandlerCallbackTests extends ApplicationTestCase {
  setupApplication() {
    log.length = 0
    this.application = new CollectingApplication(this.fixtureElement, this.schema)
    this.application.register("targets", TargetsController)
    this.application.register("values", ValuesController)
    this.application.register("outlets", OutletsController)
    this.application.register("item", Controller)
  }

  async "test an error in a target connected callback does not stop the controller from connecting"() {
    await this.renderFixture(`
      <div data-controller="targets" id="host">
        <div data-targets-target="item" id="a" data-throw></div>
        <div data-targets-target="item" id="b"></div>
      </div>
      <div data-controller="targets" id="sibling"></div>
    `)

    this.assert.deepEqual(log, ["connected a", "connected b", "connect host", "connect sibling"])
    this.assertHandled([['Error invoking "itemTargetConnected"', "connected a", "targets"]])
  }

  async "test the target observer keeps observing after a target connected callback error"() {
    await this.renderFixture(`
      <div data-controller="targets" id="host">
        <div data-targets-target="item" id="a" data-throw></div>
      </div>
    `)
    this.findElement("#host").insertAdjacentHTML("beforeend", `<div data-targets-target="item" id="b"></div>`)
    await this.nextFrame

    this.assert.deepEqual(log, ["connected a", "connect host", "connected b"])
    this.assertHandled([['Error invoking "itemTargetConnected"', "connected a", "targets"]])
  }

  async "test an error in a target disconnected callback does not stop the controller from disconnecting"() {
    await this.renderFixture(`
      <div data-controller="targets" data-action="click->targets#clicked" id="host">
        <div data-targets-target="item" id="a"></div>
        <div data-targets-target="item" id="b"></div>
      </div>
    `)
    log.length = 0
    this.findElement("#host").removeAttribute("data-controller")
    await this.nextFrame
    await this.triggerEvent("#host", "click")

    this.assert.deepEqual(log, ["disconnected a", "disconnected b"])
    this.assertHandled([
      ['Error invoking "itemTargetDisconnected"', "disconnected a", "targets"],
      ['Error invoking "itemTargetDisconnected"', "disconnected b", "targets"],
    ])
  }

  async "test errors in outlet callbacks are handled"() {
    await this.renderFixture(`
      <div data-controller="outlets" data-outlets-item-outlet=".item"></div>
      <div data-controller="item" class="item" id="o"></div>
    `)
    this.findElement("#o").removeAttribute("data-controller")
    await this.nextFrame

    this.assertHandled([
      ['Error invoking "itemOutletConnected"', "outlet connected o", "outlets"],
      ['Error invoking "itemOutletDisconnected"', "outlet disconnected o", "outlets"],
    ])
  }

  async "test an error in a value changed callback does not stop the controller from connecting"() {
    await this.renderFixture(`
      <div data-controller="values" data-values-count-value="1" id="host"></div>
      <div data-controller="values" id="sibling"></div>
    `)
    this.findElement("#host").setAttribute("data-values-count-value", "2")
    await this.nextFrame

    this.assert.deepEqual(log, ["connect host", "connect sibling"])
    this.assertHandled([
      ['Error invoking "countValueChanged"', "count 1", "values"],
      ['Error invoking "countValueChanged"', "count 2", "values"],
    ])
  }

  async "test a value type error is handled with the value name in its message"() {
    await this.renderFixture(`<div data-controller="values" data-values-config-value="[1]" id="host"></div>`)

    const [{ error }] = this.handled
    this.assert.ok(error instanceof TypeError)
    this.assertHandled([
      [
        'Error invoking "configValueChanged"',
        'Stimulus Value "values.configValue" - expected value of type "object" but instead got value "[1]" of type "array"',
        "values",
      ],
    ])
  }

  assertHandled(expected: [string, string, string][]) {
    this.assert.deepEqual(
      this.handled.map(({ message, error, detail }) => [message, error.message, detail.identifier]),
      expected
    )
  }

  get handled() {
    return (this.application as CollectingApplication).handled
  }
}
