import { ElementObserver, ElementObserverDelegate } from "./element_observer"
import { Multimap } from "../support/multimap"

export interface TokenListObserverDelegate {
  elementMatchedTokenForAttribute?(element: Element, token: string, attributeName: string)
  elementUnmatchedTokenForAttribute?(element: Element, token: string, attributeName: string)
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
    this.tokensByElement = new Multimap
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
    const match = this.matchElement(tree) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll(this.selector))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    const newTokens = Array.from(this.readTokenSetForElement(element))
    for (const token of newTokens) {
      this.elementMatchedToken(element, token)
    }
  }

  elementUnmatched(element: Element) {
    const tokens = this.getTokensForElement(element)
    for (const token of tokens) {
      this.elementUnmatchedToken(element, token)
    }
  }

  elementAttributeChanged(element: Element) {
    const newTokenSet = this.readTokenSetForElement(element)

    for (const token of Array.from(newTokenSet)) {
      this.elementMatchedToken(element, token)
    }

    for (const token of this.getTokensForElement(element)) {
      if (!newTokenSet.has(token)) {
        this.elementUnmatchedToken(element, token)
      }
    }
  }

  // Private

  private elementMatchedToken(element: Element, token: string) {
    if (!this.tokensByElement.has(element, token)) {
      this.tokensByElement.add(element, token)
      if (this.delegate.elementMatchedTokenForAttribute) {
        this.delegate.elementMatchedTokenForAttribute(element, token, this.attributeName)
      }
    }
  }

  private elementUnmatchedToken(element: Element, token: string) {
    if (this.tokensByElement.has(element, token)) {
      this.tokensByElement.delete(element, token)
      if (this.delegate.elementUnmatchedTokenForAttribute) {
        this.delegate.elementUnmatchedTokenForAttribute(element, token, this.attributeName)
      }
    }
  }

  private getTokensForElement(element: Element): string[] {
    return this.tokensByElement.getValuesForKey(element)
  }

  private readTokenSetForElement(element: Element): Set<string> {
    const tokens = new Set
    const value = element.getAttribute(this.attributeName) || ""
    for (const token of value.split(/\s+/)) {
      if (token.length) {
        tokens.add(token)
      }
    }

    return tokens
  }
}
