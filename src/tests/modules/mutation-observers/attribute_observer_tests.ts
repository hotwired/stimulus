import { AttributeObserver, AttributeObserverDelegate } from "../../../mutation-observers/attribute_observer"
import { ObserverTestCase } from "../../cases/observer_test_case"

export default class AttributeObserverTests extends ObserverTestCase implements AttributeObserverDelegate {
  attributeName = "data-test"
  fixtureHTML = `<div id="outer" ${this.attributeName}><div id="inner"></div></div>`
  observer = new AttributeObserver(this.fixtureElement, this.attributeName, this)

  async "test elementMatchedAttribute"() {
    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", this.outerElement, this.attributeName]
    ])
  }

  async "test elementAttributeValueChanged"() {
    this.outerElement.setAttribute(this.attributeName, "hello")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", this.outerElement, this.attributeName],
      ["elementAttributeValueChanged", this.outerElement, this.attributeName]
    ])
  }

  async "test elementUnmatchedAttribute"() {
    this.outerElement.removeAttribute(this.attributeName)
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", this.outerElement, this.attributeName],
      ["elementUnmatchedAttribute", this.outerElement, this.attributeName]
    ])
  }

  async "test observes attribute changes to child elements"() {
    this.innerElement.setAttribute(this.attributeName, "hello")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", this.outerElement, this.attributeName],
      ["elementMatchedAttribute", this.innerElement, this.attributeName]
    ])
  }

  async "test ignores other attributes"() {
    this.outerElement.setAttribute(this.attributeName + "-x", "hello")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", this.outerElement, this.attributeName]
    ])
  }

  async "test observes removal of nested matched element HTML"() {
    const { innerElement, outerElement } = this

    innerElement.setAttribute(this.attributeName, "")
    await this.nextFrame

    this.fixtureElement.innerHTML = ""
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", outerElement, this.attributeName],
      ["elementMatchedAttribute", innerElement, this.attributeName],
      ["elementUnmatchedAttribute", outerElement, this.attributeName],
      ["elementUnmatchedAttribute", innerElement, this.attributeName]
    ])
  }

  async "test ignores synchronously disconnected elements"() {
    const { innerElement, outerElement } = this

    outerElement.removeChild(innerElement)
    innerElement.setAttribute(this.attributeName, "")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", outerElement, this.attributeName]
    ])
  }

  async "test ignores synchronously moved elements"() {
    const { innerElement, outerElement } = this

    document.body.appendChild(innerElement)
    innerElement.setAttribute(this.attributeName, "")
    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["elementMatchedAttribute", outerElement, this.attributeName]
    ])

    document.body.removeChild(innerElement)
  }

  get outerElement() {
    return this.findElement("#outer")
  }

  get innerElement() {
    return this.findElement("#inner")
  }

  // Attribute observer delegate

  elementMatchedAttribute(element: Element, attributeName: string) {
    this.recordCall("elementMatchedAttribute", element, attributeName)
  }

  elementAttributeValueChanged(element: Element, attributeName: string) {
    this.recordCall("elementAttributeValueChanged", element, attributeName)
  }

  elementUnmatchedAttribute(element: Element, attributeName: string) {
    this.recordCall("elementUnmatchedAttribute", element, attributeName)
  }
}
