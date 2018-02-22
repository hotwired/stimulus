import { ObserverTestCase } from "../observer_test_case"
import { TokenListObserver, TokenListObserverDelegate } from "@stimulus/mutation-observers"

export default class TokenListObserverTests extends ObserverTestCase implements TokenListObserverDelegate {
  attributeName = "data-test"
  fixtureHTML = `<div ${this.attributeName}="one two"></div>`
  observer = new TokenListObserver(this.fixtureElement, this.attributeName, this)

  async "test elementMatchedTokenForAttribute"() {
    this.assert.deepEqual(this.calls, [
      ["elementMatchedTokenForAttribute", [this.element, "one", this.attributeName]],
      ["elementMatchedTokenForAttribute", [this.element, "two", this.attributeName]]
    ])
  }

  async "test elementUnmatchedTokenForAttribute"() {
    this.element.setAttribute(this.attributeName, "one")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedTokenForAttribute", [this.element, "one", this.attributeName]],
      ["elementMatchedTokenForAttribute", [this.element, "two", this.attributeName]],
      ["elementUnmatchedTokenForAttribute", [this.element, "two", this.attributeName]]
    ])
  }

  async "test matched tokens are unique"() {
    this.element.setAttribute(this.attributeName, "two one two three three")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedTokenForAttribute", [this.element, "one", this.attributeName]],
      ["elementMatchedTokenForAttribute", [this.element, "two", this.attributeName]],
      ["elementMatchedTokenForAttribute", [this.element, "three", this.attributeName]]
    ])
  }

  get element() {
    return this.findElement("div")
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.recordCall("elementMatchedTokenForAttribute", element, token, attributeName)
  }

  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.recordCall("elementUnmatchedTokenForAttribute", element, token, attributeName)
  }
}
