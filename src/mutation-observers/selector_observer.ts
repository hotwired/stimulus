import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Multimap } from "../multimap"

export interface SelectorObserverDelegate {
  selectorMatched(element: Element, selector: string, details: object): void
  selectorUnmatched(element: Element, selector: string, details: object): void
  selectorMatchElement?(element: Element, details: object): boolean
}

export class SelectorObserver implements ElementObserverDelegate {
  private selector: string
  private elementObserver: ElementObserver
  private delegate: SelectorObserverDelegate
  private matchesByElement: Multimap<string, Element>
  private details: object

  constructor(element: Element, selector: string, delegate: SelectorObserverDelegate, details: object = {}) {
    this.selector = selector
    this.details = details
    this.elementObserver = new ElementObserver(element, this)
    this.delegate = delegate
    this.matchesByElement = new Multimap
  }

  get started(): boolean {
    return this.elementObserver.started
  }

  start() {
    this.elementObserver.start()
  }

  pause(callback: () => void) {
    this.elementObserver.pause(callback)
  }

  stop() {
    this.elementObserver.stop()
  }

  refresh() {
    this.elementObserver.refresh()
  }

  get element(): Element {
    return this.elementObserver.element
  }

  // Element observer delegate

  matchElement(element: Element): boolean {
    const matches = element.matches(this.selector)

    if (this.delegate.selectorMatchElement) {
      return matches && this.delegate.selectorMatchElement(element, this.details)
    }

    return matches
  }

  matchElementsInTree(tree: Element): Element[] {
    const match = this.matchElement(tree) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll(this.selector)).filter(match => this.matchElement(match))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    this.selectorMatched(element)
  }

  elementUnmatched(element: Element) {
    this.selectorUnmatched(element)
  }

  elementAttributeChanged(element: Element, _attributeName: string) {
    const matches = this.matchElement(element)
    const matchedBefore = this.matchesByElement.has(this.selector, element)

    if (!matches && matchedBefore) {
      this.selectorUnmatched(element)
    }
  }

  private selectorMatched(element: Element) {
    if (this.delegate.selectorMatched) {
      this.delegate.selectorMatched(element, this.selector, this.details)
      this.matchesByElement.add(this.selector, element)
    }
  }

  private selectorUnmatched(element: Element) {
    this.delegate.selectorUnmatched(element, this.selector, this.details)
    this.matchesByElement.delete(this.selector, element)
  }
}
