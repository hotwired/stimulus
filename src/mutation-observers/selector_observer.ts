import { AttributeObserver, AttributeObserverDelegate } from "./attribute_observer"
import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Multimap } from "../multimap"

export interface SelectorObserverDelegate {
  selectorMatched(element: Element, selector: string, details: object): void
  selectorUnmatched(element: Element, selector: string, details: object): void
  selectorMatchElement?(element: Element, details: object): boolean
}

export class SelectorObserver implements AttributeObserverDelegate, ElementObserverDelegate {
  private readonly attributeObserver: AttributeObserver
  private readonly elementObserver: ElementObserver
  private readonly delegate: SelectorObserverDelegate
  private readonly matchesByElement: Multimap<string, Element>
  private readonly details: object
  private selector: string | null

  constructor(
    element: Element,
    attributeName: string,
    scope: Element,
    delegate: SelectorObserverDelegate,
    details: object
  ) {
    this.details = details
    this.attributeObserver = new AttributeObserver(element, attributeName, this)
    this.selector = element.getAttribute(this.attributeName)
    this.elementObserver = new ElementObserver(scope, this)
    this.delegate = delegate
    this.matchesByElement = new Multimap()
  }

  get started(): boolean {
    return this.elementObserver.started
  }

  start() {
    this.elementObserver.start()
    this.attributeObserver.start()
  }

  pause(callback: () => void) {
    this.elementObserver.pause(() => this.attributeObserver.pause(callback))
  }

  stop() {
    this.attributeObserver.stop()
    this.elementObserver.stop()
  }

  refresh() {
    this.attributeObserver.refresh()
    this.elementObserver.refresh()
  }

  // Attribute observer delegate

  elementMatchedAttribute(controllerElement: Element) {
    this.selector = controllerElement.getAttribute(this.attributeName)

    this.elementObserver.refresh()
  }

  elementUnmatchedAttribute() {
    if (this.selector) {
      const matchedElements = this.matchesByElement.getValuesForKey(this.selector)

      for (const matchedElement of matchedElements) {
        this.selectorUnmatched(matchedElement, this.selector)
      }
    }

    this.selector = null
  }

  elementAttributeValueChanged(controllerElement: Element) {
    this.elementMatchedAttribute(controllerElement)
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
    const { selector } = this

    if (selector) {
      this.selectorUnmatched(element, selector)
    }
  }

  elementAttributeChanged(element: Element, _attributeName: string) {
    const { selector } = this

    if (selector) {
      const matches = this.matchElement(element)
      const matchedBefore = this.matchesByElement.has(selector, element)

      if (!matches && matchedBefore) {
        this.selectorUnmatched(element, selector)
      }
    }
  }

  private selectorMatched(element: Element, selector: string) {
    if (this.delegate.selectorMatched) {
      this.delegate.selectorMatched(element, selector, this.details)
      this.matchesByElement.add(selector, element)
    }
  }

  private selectorUnmatched(element: Element, selector: string) {
    this.delegate.selectorUnmatched(element, selector, this.details)
    this.matchesByElement.delete(selector, element)
  }

  private get attributeName() {
    return this.attributeObserver.attributeName
  }
}
