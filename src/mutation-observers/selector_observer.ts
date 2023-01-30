import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Multimap } from "../multimap"

export interface SelectorObserverDelegate {
  selectorMatched(element: Element, selector: string, details: object): void
  selectorUnmatched(element: Element, selector: string, details: object): void
  selectorMatchElement?(element: Element, details: object): boolean
}

export class SelectorObserver implements ElementObserverDelegate {
  private readonly elementObserver: ElementObserver
  private readonly delegate: SelectorObserverDelegate
  private readonly matchesByElement: Multimap<string, Element>
  private readonly details: object
  _selector: string | null

  constructor(element: Element, selector: string, delegate: SelectorObserverDelegate, details: object) {
    this._selector = selector
    this.details = details
    this.elementObserver = new ElementObserver(element, this)
    this.delegate = delegate
    this.matchesByElement = new Multimap()
  }

  get started(): boolean {
    return this.elementObserver.started
  }

  get selector() {
    return this._selector
  }

  set selector(selector: string | null) {
    this._selector = selector
    this.refresh()
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
    const { selector } = this

    if (selector) {
      const matches = element.matches(selector)

      if (this.delegate.selectorMatchElement) {
        return matches && this.delegate.selectorMatchElement(element, this.details)
      }

      return matches
    } else {
      return false
    }
  }

  matchElementsInTree(tree: Element): Element[] {
    const { selector } = this

    if (selector) {
      const match = this.matchElement(tree) ? [tree] : []
      const matches = Array.from(tree.querySelectorAll(selector)).filter((match) => this.matchElement(match))
      return match.concat(matches)
    } else {
      return []
    }
  }

  elementMatched(element: Element) {
    const { selector } = this

    if (selector) {
      this.selectorMatched(element, selector)
    }
  }

  elementUnmatched(element: Element) {
    const selectors = this.matchesByElement.getKeysForValue(element)

    for (const selector of selectors) {
      this.selectorUnmatched(element, selector)
    }
  }

  elementAttributeChanged(element: Element, _attributeName: string) {
    const { selector } = this

    if (selector) {
      const matches = this.matchElement(element)
      const matchedBefore = this.matchesByElement.has(selector, element)

      if (matches && !matchedBefore) {
        this.selectorMatched(element, selector)
      } else if (!matches && matchedBefore) {
        this.selectorUnmatched(element, selector)
      }
    }
  }

  // Selector management

  private selectorMatched(element: Element, selector: string) {
    this.delegate.selectorMatched(element, selector, this.details)
    this.matchesByElement.add(selector, element)
  }

  private selectorUnmatched(element: Element, selector: string) {
    this.delegate.selectorUnmatched(element, selector, this.details)
    this.matchesByElement.delete(selector, element)
  }
}
