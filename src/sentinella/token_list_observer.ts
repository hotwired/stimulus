import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Multimap } from "./multimap"

export interface TokenListObserverDelegate {
  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string)
  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string)
}

export class TokenListObserver implements ElementObserverDelegate {
  attributeName: string
  private delegate: TokenListObserverDelegate

  private elementObserver: ElementObserver
  private tokensByElement: Multimap<Element, string>

  constructor(element: Element, attributeName: string, delegate: TokenListObserverDelegate) {
    this.attributeName = attributeName
    this.delegate = delegate

    this.elementObserver = new ElementObserver(element, this)
    this.tokensByElement = new Multimap<Element, string>()
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

  get selector(): string {
    return `[${this.attributeName}]`
  }

  getElementsMatchingToken(token: string): Element[] {
    return this.tokensByElement.getKeysForValue(token)
  }

  // Element observer delegate

  matchElement(element: Element): boolean {
    return element.hasAttribute(this.attributeName)
  }

  matchElementsInTree(tree: Element): Element[] {
    const match = tree.matches(this.selector) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll(this.selector))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    const newTokens = Array.from(this.readTokenSetForElement(element))
    for (const token of newTokens) {
      this.addTokenForElement(token, element)
    }
  }

  elementUnmatched(element: Element) {
    const tokens = this.getTokensForElement(element)
    for (const token of tokens) {
      this.removeTokenForElement(token, element)
    }
  }

  elementAttributeChanged(element: Element) {
    const newTokenSet = this.readTokenSetForElement(element)

    for (const token of Array.from(newTokenSet)) {
      this.addTokenForElement(token, element)
    }

    for (const token of this.getTokensForElement(element)) {
      if (!newTokenSet.has(token)) {
        this.removeTokenForElement(token, element)
      }
    }
  }

  // Private

  addTokenForElement(token: string, element: Element) {
    if (!this.tokensByElement.has(element, token)) {
      this.tokensByElement.add(element, token)
      this.delegate.elementMatchedTokenForAttribute(element, token, this.attributeName)
    }
  }

  removeTokenForElement(token: string, element: Element) {
    if (this.tokensByElement.has(element, token)) {
      this.tokensByElement.delete(element, token)
      this.delegate.elementUnmatchedTokenForAttribute(element, token, this.attributeName)
    }
  }

  getTokensForElement(element: Element): string[] {
    return this.tokensByElement.getValuesForKey(element)
  }

  readTokenSetForElement(element: Element): Set<string> {
    const tokens = new Set<string>()
    const value = element.getAttribute(this.attributeName) || ""
    for (const token of value.split(/\s+/)) {
      if (token.length) {
        tokens.add(token)
      }
    }

    return tokens
  }
}
