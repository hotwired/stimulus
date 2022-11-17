import { SelectorObserver, SelectorObserverDelegate } from "../../../mutation-observers/selector_observer"
import { ObserverTestCase } from "../../cases/observer_test_case"

export default class SelectorObserverTests extends ObserverTestCase implements SelectorObserverDelegate {
  attributeName = "data-test"
  selector = "div[data-test~=two]"
  details = { some: "details" }

  fixtureHTML = `
    <div id="container" ${this.attributeName}="one two">
      <div id="div1" ${this.attributeName}="one"></div>
      <div id="div2" ${this.attributeName}="two"></div>
      <span id="span1" ${this.attributeName}="one"></span>
      <span id="span2" ${this.attributeName}="two"></span>
    </div>
  `
  observer = new SelectorObserver(this.fixtureElement, this.selector, this, this.details)

  async "test should match when observer starts"() {
    this.assert.deepEqual(this.calls, [
      ["selectorMatched", this.element, this.selector, this.details],
      ["selectorMatched", this.div2, this.selector, this.details],
    ])
  }

  async "test should match when element gets appended"() {
    const element1 = document.createElement("div")
    const element2 = document.createElement("div")

    element1.dataset.test = "one two"
    element2.dataset.test = "three four"

    this.element.appendChild(element1)
    this.element.appendChild(element2)

    await this.nextFrame

    this.assert.deepEqual(this.calls, [
      ["selectorMatched", this.element, this.selector, this.details],
      ["selectorMatched", this.div2, this.selector, this.details],
      ["selectorMatched", element1, this.selector, this.details],
    ])
  }

  async "test should not match/unmatch when the attribute gets updated and matching selector persists"() {
    this.element.setAttribute(this.attributeName, "two three")

    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [])
  }

  async "test should match when attribute gets updated and start to matche selector"() {
    this.div1.setAttribute(this.attributeName, "updated two")

    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [["selectorMatched", this.div1, this.selector, this.details]])
  }

  async "test should unmatch when attribute gets updated but matching attribute value gets removed"() {
    this.div2.setAttribute(this.attributeName, "updated")

    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [["selectorUnmatched", this.div2, this.selector, this.details]])
  }

  async "test should unmatch when attribute gets removed"() {
    this.element.removeAttribute(this.attributeName)
    this.div2.removeAttribute(this.attributeName)

    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["selectorUnmatched", this.element, this.selector, this.details],
      ["selectorUnmatched", this.div2, this.selector, this.details],
    ])
  }

  async "test should unmatch when element gets removed"() {
    const element = this.element
    const div1 = this.div1
    const div2 = this.div2

    element.remove()
    div1.remove()
    div2.remove()

    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [
      ["selectorUnmatched", element, this.selector, this.details],
      ["selectorUnmatched", div2, this.selector, this.details],
    ])
  }

  async "test should not match/unmatch when observer is paused"() {
    this.observer.pause(() => {
      this.div2.remove()

      const element = document.createElement("div")
      element.dataset.test = "one two"
      this.element.appendChild(element)
    })

    await this.nextFrame

    this.assert.deepEqual(this.testCalls, [])
  }

  get element(): Element {
    return this.findElement("#container")
  }

  get div1(): Element {
    return this.findElement("#div1")
  }

  get div2(): Element {
    return this.findElement("#div2")
  }

  // Selector observer delegate

  selectorMatched(element: Element, selector: string, details: object) {
    this.recordCall("selectorMatched", element, selector, details)
  }

  selectorUnmatched(element: Element, selector: string, details: object) {
    this.recordCall("selectorUnmatched", element, selector, details)
  }
}
