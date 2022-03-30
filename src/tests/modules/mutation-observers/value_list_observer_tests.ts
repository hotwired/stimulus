import { Token, ValueListObserver, ValueListObserverDelegate } from "../../../mutation-observers"
import { ObserverTestCase } from "../../cases/observer_test_case"

export interface Value {
  id: number
  token: Token
}

export default class ValueListObserverTests extends ObserverTestCase implements ValueListObserverDelegate<Value> {
  attributeName = "data-test"
  fixtureHTML = `<div ${this.attributeName}="one"></div>`
  observer = new ValueListObserver(this.fixtureElement, this.attributeName, this)
  lastValueId = 0

  async "test elementMatchedValue"() {
    this.assert.deepEqual(this.calls, [
      ["elementMatchedValue", this.element, 1, "one"]
    ])
  }

  async "test adding a token to the right"() {
    this.valueString = "one two"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["elementMatchedValue", this.element, 2, "two"]
    ])
  }

  async "test adding a token to the left"() {
    this.valueString = "two one"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["elementUnmatchedValue", this.element, 1, "one"],
      ["elementMatchedValue", this.element, 2, "two"],
      ["elementMatchedValue", this.element, 3, "one"]
    ])
  }

  async "test removing a token from the right"() {
    this.valueString = "one two"
    await this.nextFrame
    this.valueString = "one"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["elementMatchedValue", this.element, 2, "two"],
      ["elementUnmatchedValue", this.element, 2, "two"]
    ])
  }

  async "test removing a token from the left"() {
    this.valueString = "one two"
    await this.nextFrame
    this.valueString = "two"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["elementMatchedValue", this.element, 2, "two"],
      ["elementUnmatchedValue", this.element, 1, "one"],
      ["elementUnmatchedValue", this.element, 2, "two"],
      ["elementMatchedValue", this.element, 3, "two"]
    ])
  }

  async "test removing the only token"() {
    this.valueString = ""
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["elementUnmatchedValue", this.element, 1, "one"]
    ])
  }

  async "test removing and re-adding a token produces a new value"() {
    this.valueString = ""
    await this.nextFrame
    this.valueString = "one"
    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["elementUnmatchedValue", this.element, 1, "one"],
      ["elementMatchedValue", this.element, 2, "one"]
    ])
  }

  get element() {
    return this.findElement("div")
  }

  set valueString(value: string) {
    this.element.setAttribute(this.attributeName, value)
  }

  // Value observer delegate

  parseValueForToken(token: Token) {
    return { id: ++this.lastValueId, token }
  }

  elementMatchedValue(element: Element, value: Value) {
    this.recordCall("elementMatchedValue", element, value.id, value.token.content)
  }

  elementUnmatchedValue(element: Element, value: Value) {
    this.recordCall("elementUnmatchedValue", element, value.id, value.token.content)
  }
}
