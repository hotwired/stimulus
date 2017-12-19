import "@stimulus/polyfills"
import { Application, Controller } from "stimulus"
const { assert, module, test } = QUnit

export { assert, test }

export function testGroup(name: string, callback: Function) {
  module(name, function (hooks) {
    hooks.beforeEach(function () {
      this.application = Application.start()
    })

    hooks.afterEach(function () {
      this.application.stop()
    })

    callback(hooks)
  })
}

export function getFixture(): HTMLDivElement {
  return document.getElementById("qunit-fixture") as HTMLDivElement
}

export function setFixture(content: string | Element) {
  if (typeof content == "string") {
    getFixture().innerHTML = content
  } else {
    getFixture().appendChild(content)
  }

  return nextFrame()
}

export function queryFixture(selector: string): Element {
  const element = getFixture().querySelector(selector)
  if (element) {
    return element
  } else {
    throw new Error(`No element found for ${JSON.stringify(selector)} in fixture`)
  }
}

export function getControllerSelector(identifier: string): string {
  return `[data-controller~="${identifier}"]`
}

export function getActionSelector(identifier: string, actionName: string): string {
  return `[data-action~="${identifier}#${actionName}"]`
}

export function getTargetSelector(identifier: string, targetName: string): string {
  return `[data-target~="${identifier}.${targetName}"]`
}

export function nextFrame(): Promise<any> {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

export function triggerEvent(eventTarget: EventTarget, type: string): Event {
  const event = document.createEvent("Events")
  event.initEvent(type, true, true)
  // IE <= 11 does not set `defaultPrevented` when `preventDefault()` is called on synthetic events
  event.preventDefault = function() {
    Object.defineProperty(this, "defaultPrevented", {
      get: function() {
        return true
      },
      configurable: true
    })
  }
  eventTarget.dispatchEvent(event)
  return event
}

export class TestController extends Controller {
  lifecycle: { initialize: number, connect: number, disconnect: number }
  actions: Array<{ eventType: string, eventPrevented: boolean, eventTarget: EventTarget, target: EventTarget }>

  constructor(context) {
    super(context)
    this.lifecycle = { initialize: 0, connect: 0, disconnect: 0 }
    this.actions = []
  }

  initialize() {
    this.lifecycle.initialize++
  }

  connect() {
    this.lifecycle.connect++
  }

  disconnect() {
    this.lifecycle.disconnect++
  }

  foo(event, target) {
    this.recordAction(event, target)
  }

  private recordAction(event: Event, target: EventTarget) {
    this.actions.push({ eventType: event.type, eventPrevented: event.defaultPrevented, eventTarget: event.target, target: target })
  }
}
