import { ObserverTestCase } from "../observer_test_case"
import { Token, TokenObserver, TokenObserverDelegate, TokenSource } from "@stimulus/mutation-observers"

export interface TestValue {
  identifier: string
  source: TokenSource
}

export default class TokenObserverTests extends ObserverTestCase implements TokenObserverDelegate<TestValue> {
  attributeName = "data-test"
  fixtureHTML = `<div ${this.attributeName}="one"></div>`
  observer = new TokenObserver(this.fixtureElement, this.attributeName, this)

  async "test elementMatchedToken"() {
    this.assert.deepEqual(this.callNames, [
      "parseValueFromTokenSource",
      "elementMatchedToken"
    ])

    const [[tokenSource], [token]] = this.callArguments
    this.assert.equal(token.value.identifier, "one")
    this.assert.equal(token.source, tokenSource)
  }

  async "test elementUnmatchedToken"() {
    this.element.removeAttribute(this.attributeName)
    await this.nextFrame

    this.assert.deepEqual(this.callNames, [
      "parseValueFromTokenSource",
      "elementMatchedToken",
      "elementUnmatchedToken"
    ])
  }

  async "test tokens are parsed once per element"() {
    this.element.setAttribute(this.attributeName, "")
    await this.nextFrame
    this.element.setAttribute(this.attributeName, "one")
    await this.nextFrame

    const [[firstToken], [secondToken]] = this.callArguments.slice(-2)
    this.assert.strictEqual(firstToken, secondToken)
  }

  async "test handleErrorParsingToken"() {
    this.element.setAttribute(this.attributeName, "one error")
    await this.nextFrame

    const callNames = this.callNames
    this.assert.deepEqual(callNames, [
      "parseValueFromTokenSource",
      "elementMatchedToken",
      "parseValueFromTokenSource",
      "handleErrorParsingTokenSource"
    ])

    this.element.setAttribute(this.attributeName, "one")
    await this.nextFrame
    this.assert.deepEqual(this.callNames, callNames)
  }

  get element() {
    return this.findElement("div")
  }

  // Token observer delegate

  parseValueFromTokenSource(source: TokenSource) {
    this.recordCall("parseValueFromTokenSource", source)
    if (source.value == "error") {
      throw new Error("oops")
    } else {
      return { identifier: source.value, source }
    }
  }

  handleErrorParsingTokenSource(error: Error, source: TokenSource) {
    this.recordCall("handleErrorParsingTokenSource", error, source)
  }

  elementMatchedToken(token: Token<TestValue>) {
    this.recordCall("elementMatchedToken", token)
  }

  elementUnmatchedToken(token: Token<TestValue>) {
    this.recordCall("elementUnmatchedToken", token)
  }
}
