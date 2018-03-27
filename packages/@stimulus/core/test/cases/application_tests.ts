import { ApplicationTestCase } from "@stimulus/test"
import { LogController } from "../log_controller"

class AController extends LogController {}
class BController extends LogController {}
class CController extends LogController {}

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
    this.assert.equal(this.controllers[0].constructor["blessCount"], 1)

    this.assert.ok(this.controllers[1] instanceof BController)
    this.assert.equal(this.controllers[1].initializeCount, 1)
    this.assert.equal(this.controllers[1].connectCount, 1)
    this.assert.equal(this.controllers[1].constructor["blessCount"], 1)
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
    this.assert.equal(this.controllers[1].constructor["blessCount"], 1)
  }

  async "test starting an application when the document is loading"() {
    const iframe = this.installIframe("/core/application/index.html")
    const message = await messageFromIframeStartState(iframe, "loading")
    this.assert.notEqual(message.connectState, "loading")
    this.assert.equal(message.targetCount, 3)
  }

  async "test starting an application when the document is interactive"() {
    const iframe = this.installIframe("/core/application/index.html")
    const message = await messageFromIframeStartState(iframe, "interactive")
    this.assert.equal(message.targetCount, 3)
  }

  async "test starting an application when the document is complete"() {
    const iframe = this.installIframe("/core/application/index.html")
    const message = await messageFromIframeStartState(iframe, "complete")
    this.assert.equal(message.targetCount, 3)
  }

  get controllers() {
    return this.application.controllers as LogController[]
  }

  private installIframe(src: string): HTMLIFrameElement {
    const iframe = document.createElement("iframe")
    iframe.src = src
    this.fixtureElement.appendChild(iframe)
    return iframe
  }
}

function messageFromIframeStartState(iframe: HTMLIFrameElement, startState: string): Promise<any> {
  return new Promise(resolve => {
    function receiveMessage(event) {
      if (event.source == iframe.contentWindow) {
        const message = JSON.parse(event.data)
        if (message.startState == startState) {
          removeEventListener("message", receiveMessage)
          resolve(message)
        }
      }
    }
    addEventListener("message", receiveMessage)
  })
}
