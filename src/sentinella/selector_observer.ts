import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Selector } from "./selector"
import { Multimap } from "./multimap"

export interface SelectorObserverDelegate {
  elementMatchedSelector(element: Element, selector: Selector)
  elementUnmatchedSelector(element: Element, selector: Selector)
}

export class SelectorObserver implements ElementObserverDelegate {
  elementObserver: ElementObserver
  delegate: SelectorObserverDelegate

  selectors: Set<Selector>
  elements: Multimap<Selector, Element>
  attributes: Multimap<Selector, string>

  constructor(element: Element, delegate: SelectorObserverDelegate) {
    this.elementObserver = new ElementObserver(element, this)
    this.delegate = delegate

    this.selectors = new Set<Selector>()
    this.elements = new Multimap<Selector, Element>()
    this.attributes = new Multimap<Selector, string>()
  }

  start() {
    this.elementObserver.start()
  }

  stop() {
    this.elementObserver.stop()
  }

  get element(): Element {
    return this.elementObserver.element
  }

  get compositeSelector(): string {
    const compositeSelector = Array.from(this.selectors).join(", ")
    return compositeSelector.length == 0 ? ":not(*)" : compositeSelector
  }

  // Selector observation

  observeSelector(selector: Selector) {
    if (!this.selectors.has(selector)) {
      this.selectors.add(selector)
      for (const attribute of selector.attributes) {
        this.attributes.add(selector, attribute)
      }
    }
  }

  stopObservingSelector(selector: Selector) {
    if (this.selectors.has(selector)) {
      this.selectors.delete(selector)
      for (const attribute of selector.attributes) {
        this.attributes.delete(selector, attribute)
      }
    }
  }

  // Element observer delegate

  matchElement(element: Element): boolean {
    return element.matches(this.compositeSelector)
  }

  matchElementsInTree(tree: Element): Element[] {
    const match = tree.matches(this.compositeSelector) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll(this.compositeSelector))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    for (const selector of this.selectors) {
      if (!this.elements.has(selector, element)) {
        if (selector.matches(element)) {
          this.recordMatch(selector, element)
        }
      }
    }
  }

  elementUnmatched(element: Element) {
    for (const selector of this.selectors) {
      if (this.elements.has(selector, element)) {
        this.recordUnmatch(selector, element)
      }
    }
  }

  elementAttributeChanged(element: Element, attributeName: string) {
    for (const selector of this.attributes.getKeysForValue(attributeName)) {
      const matched = selector.matches(element)
      const present = this.elements.has(selector, element)

      if (matched && !present) {
        this.recordMatch(selector, element)
      } else if (present && !matched) {
        this.recordUnmatch(selector, element)
      }
    }
  }

  // Element bookkeeping

  private recordMatch(selector: Selector, element: Element) {
    this.elements.add(selector, element)
    this.delegate.elementMatchedSelector(element, selector)
  }

  private recordUnmatch(selector: Selector, element: Element) {
    this.elements.delete(selector, element)
    this.delegate.elementUnmatchedSelector(element, selector)
  }
}
