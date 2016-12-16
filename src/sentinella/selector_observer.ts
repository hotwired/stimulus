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

  selectorSet: Set<Selector>
  elements: Multimap<Selector, Element>
  attributes: Multimap<Selector, string>

  constructor(element: Element, delegate: SelectorObserverDelegate) {
    this.elementObserver = new ElementObserver(element, this)
    this.delegate = delegate

    this.selectorSet = new Set<Selector>()
    this.elements = new Multimap<Selector, Element>()
    this.attributes = new Multimap<Selector, string>()
  }

  get started(): boolean {
    return this.elementObserver.started
  }

  start() {
    this.elementObserver.start()
    this.refresh()
  }

  stop() {
    this.elementObserver.stop()
  }

  refresh() {
    if (!this.started) return

    const previousMatches = new Set<Element>()
    const currentMatches = new Set<Element>(this.matchElementsInTree())

    for (const selector of this.selectorSet) {
      for (const element of this.elements.getValuesForKey(selector)) {
        previousMatches.add(element)
        if (!currentMatches.has(element)) {
          this.recordUnmatch(selector, element)
        }
      }
    }

    for (const element of Array.from(currentMatches)) {
      if (!previousMatches.has(element)) {
        this.elementMatched(element)
      }
    }
  }

  get element(): Element {
    return this.elementObserver.element
  }

  get selectors(): Selector[] {
    return Array.from(this.selectorSet)
  }

  get compositeSelector(): string {
    const compositeSelector = Array.from(this.selectorSet).join(", ")
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
    return element.matches(this.compositeSelector)
  }

  matchElementsInTree(tree: Element = this.element): Element[] {
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
