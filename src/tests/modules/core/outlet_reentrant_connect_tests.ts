import { ApplicationTestCase } from "../../cases/application_test_case"
import { Controller } from "../../../core/controller"

const counts: Record<string, number> = {}

function count(key: string) {
  counts[key] = (counts[key] || 0) + 1
}

class ItemController extends Controller {
  static outlets = ["item"]
  itemOutlets!: Controller[]

  initialize() {
    count("item-initialize")
    this.itemOutlets
  }

  connect() {
    count("item-connect")
  }
}

class AlphaController extends Controller {
  static outlets = ["beta"]
  betaOutlets!: Controller[]

  initialize() {
    count("alpha-initialize")
    this.betaOutlets
  }

  connect() {
    count("alpha-connect")
  }
}

class BetaController extends Controller {
  static outlets = ["alpha"]
  alphaOutlets!: Controller[]

  initialize() {
    count("beta-initialize")
    this.alphaOutlets
  }

  connect() {
    count("beta-connect")
  }
}

export default class OutletReentrantConnectTests extends ApplicationTestCase {
  fixtureHTML = `
    <div id="item-1" class="item" data-controller="item" data-item-item-outlet=".item"></div>
    <div id="item-2" class="item" data-controller="item" data-item-item-outlet=".item"></div>
    <div id="alpha" data-controller="alpha" data-alpha-beta-outlet="#beta"></div>
    <div id="beta" data-controller="beta" data-beta-alpha-outlet="#alpha"></div>
  `

  setupApplication() {
    Object.keys(counts).forEach((key) => delete counts[key])
    this.application.register("item", ItemController)
    this.application.register("alpha", AlphaController)
    this.application.register("beta", BetaController)
  }

  async "test controllers reading outlets that resolve to themselves in initialize() connect once"() {
    this.assert.equal(counts["item-initialize"], 2)
    this.assert.equal(counts["item-connect"], 2)
  }

  async "test controllers reading each other's outlets in initialize() connect once"() {
    this.assert.equal(counts["alpha-initialize"], 1)
    this.assert.equal(counts["alpha-connect"], 1)
    this.assert.equal(counts["beta-initialize"], 1)
    this.assert.equal(counts["beta-connect"], 1)
  }
}
