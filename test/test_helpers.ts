import { Application } from "stimulus"
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

export function setFixture(content: string | Element, callback) {
  if (typeof content == "string") {
    getFixture().innerHTML = content
  } else {
    getFixture().appendChild(content)
  }

  requestAnimationFrame(callback)
}

export function createControllerElement(identifier: string, innerHTML: string = ""): HTMLDivElement {
  const element = document.createElement("div")
  element.setAttribute("data-controller", identifier)
  element.innerHTML = innerHTML
  return element
}
