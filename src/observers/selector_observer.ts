import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Selector, elementMatchesSelector } from "../support/selector"
import { Multimap } from "../support/multimap"

export interface SelectorObserverDelegate {
  elementMatchedSelector?(element: Element, selector: Selector)
  elementUnmatchedSelector?(element: Element, selector: Selector)
}

export class SelectorObserver implements ElementObserverDelegate {
  private delegate: SelectorObserverDelegate

  private elementObserver: ElementObserver
  private selectorSet: Set<Selector>
  private elements: Multimap<Selector, Element>
  private attributes: Multimap<Selector, string>

  constructor(element: Element, delegate: SelectorObserverDelegate) {
    this.delegate = delegate

    this.elementObserver = new ElementObserver(element, this)
    this.selectorSet = new Set
    this.elements = new Multimap
    this.attributes = new Multimap
  }

  get started(): boolean {
    return this.elementObserver.started
  }

  start() {
    this.elementObserver.start()
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

  get selectors(): Selector[] {
    return Array.from(this.selectorSet)
  }

  get compositeSelector(): string {
    const compositeSelector = this.selectors.join(", ")
    return compositeSelector.length == 0 ? ":not(*)" : compositeSelector
  }

  // Selector observation

  observeSelector(selector: Selector) {
    if (!this.selectorSet.has(selector)) {
      this.selectorSet.add(selector)
      for (const attribute of selector.attributes) {
        this.attributes.add(selector, attribute)
      }
      this.refresh()
    }
  }

  stopObservingSelector(selector: Selector) {
    if (this.selectorSet.has(selector)) {
      this.selectorSet.delete(selector)
      for (const attribute of selector.attributes) {
        this.attributes.delete(selector, attribute)
      }
      this.refresh()
    }
  }

  // Element observer delegate

  matchElement(element: Element): boolean {
    return elementMatchesSelector(element, this.compositeSelector)
  }

  matchElementsInTree(tree: Element): Element[] {
    const match = this.matchElement(tree) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll(this.compositeSelector))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    for (const selector of this.selectors) {
      if (!this.elements.has(selector, element)) {
        if (selector.matches(element)) {
          this.elementMatchedSelector(element, selector)
        }
      }
    }
  }

  elementUnmatched(element: Element) {
    for (const selector of this.selectors) {
      if (this.elements.has(selector, element)) {
        this.elementUnmatchedSelector(element, selector)
      }
    }
  }

  elementAttributeChanged(element: Element, attributeName: string) {
    for (const selector of this.attributes.getKeysForValue(attributeName)) {
      const matched = selector.matches(element)
      const present = this.elements.has(selector, element)

      if (matched && !present) {
        this.elementMatchedSelector(element, selector)
      } else if (present && !matched) {
        this.elementUnmatchedSelector(element, selector)
      }
    }
  }

  // Element bookkeeping

  private elementMatchedSelector(element: Element, selector: Selector) {
    this.elements.add(selector, element)
    if (this.delegate.elementMatchedSelector) {
      this.delegate.elementMatchedSelector(element, selector)
    }
  }

  private elementUnmatchedSelector(element: Element, selector: Selector) {
    this.elements.delete(selector, element)
    if (this.delegate.elementUnmatchedSelector) {
      this.delegate.elementUnmatchedSelector(element, selector)
    }
  }
}
