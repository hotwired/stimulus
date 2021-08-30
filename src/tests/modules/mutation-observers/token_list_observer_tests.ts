import { Token, TokenListObserver, TokenListObserverDelegate } from "../../../mutation-observers/token_list_observer"
import { ObserverTestCase } from "../../cases/observer_test_case"

export default class TokenListObserverTests extends ObserverTestCase implements TokenListObserverDelegate {
  attributeName = "data-test"
  fixtureHTML = `<div ${this.attributeName}="one two"></div>`
  observer = new TokenListObserver(this.fixtureElement, this.attributeName, this)

  async "test tokenMatched"() {
    this.assert.deepEqual(this.calls, [
      ["tokenMatched", this.element, this.attributeName, "one", 0],
      ["tokenMatched", this.element, this.attributeName, "two", 1]
    ])
  }

  async "test adding a token to the right"() {
    this.tokenString = "one two three"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["tokenMatched", this.element, this.attributeName, "three", 2]
    ])
  }

  async "test inserting a token in the middle"() {
    this.tokenString = "one three two"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["tokenUnmatched", this.element, this.attributeName, "two", 1],
      ["tokenMatched", this.element, this.attributeName, "three", 1],
      ["tokenMatched", this.element, this.attributeName, "two", 2]
    ])
  }

  async "test removing the leftmost token"() {
    this.tokenString = "two"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["tokenUnmatched", this.element, this.attributeName, "one", 0],
      ["tokenUnmatched", this.element, this.attributeName, "two", 1],
      ["tokenMatched", this.element, this.attributeName, "two", 0]
    ])
  }

  async "test removing the rightmost token"() {
    this.tokenString = "one"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["tokenUnmatched", this.element, this.attributeName, "two", 1]
    ])
  }

  async "test removing the only token"() {
    this.tokenString = "one"
    await this.nextFrame
    this.tokenString = ""
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["tokenUnmatched", this.element, this.attributeName, "two", 1],
      ["tokenUnmatched", this.element, this.attributeName, "one", 0]
    ])
  }

  get element(): Element {
    return this.findElement("div")
  }

  set tokenString(value: string) {
    this.element.setAttribute(this.attributeName, value)
  }

  // Token observer delegate

  tokenMatched(token: Token) {
    this.recordCall("tokenMatched", token.element, token.attributeName, token.content, token.index)
  }

  tokenUnmatched(token: Token) {
    this.recordCall("tokenUnmatched", token.element, token.attributeName, token.content, token.index)
  }
}
