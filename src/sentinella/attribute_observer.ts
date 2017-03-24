import { ElementObserver, ElementObserverDelegate } from "./element_observer"

export interface AttributeObserverDelegate {
  elementMatchedAttribute(element: Element, attributeName: string)
  elementAttributeValueChanged(element: Element, attributeName: string)
  elementUnmatchedAttribute(element: Element, attributeName: string)
}

export class AttributeObserver implements ElementObserverDelegate {
  attributeName: string
  private delegate: AttributeObserverDelegate

  private elementObserver: ElementObserver

  constructor(element: Element, attributeName: string, delegate: AttributeObserverDelegate) {
    this.attributeName = attributeName
    this.delegate = delegate

    this.elementObserver = new ElementObserver(element, this)
  }

  get element(): Element {
    return this.elementObserver.element
  }

  get selector(): string {
    return `[${this.attributeName}]`
  }

  start() {
    this.elementObserver.start()
  }

  stop() {
    this.elementObserver.stop()
  }

  // Element observer delegate

  matchElement(element: Element): boolean {
    return element.hasAttribute(this.attributeName)
  }

  matchElementsInTree(tree: Element): Element[] {
    const match = this.matchElement(tree) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll(this.selector))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    this.delegate.elementMatchedAttribute(element, this.attributeName)
  }

  elementUnmatched(element: Element) {
    this.delegate.elementUnmatchedAttribute(element, this.attributeName)
  }

  elementAttributeChanged(element: Element, attributeName: string) {
    if (attributeName == this.attributeName) {
      this.delegate.elementAttributeValueChanged(element, attributeName)
    }
  }
}
