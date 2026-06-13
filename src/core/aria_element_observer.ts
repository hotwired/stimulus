import { Multimap } from "../multimap"
import { ElementObserver, ElementObserverDelegate } from "../mutation-observers/element_observer"
import {
  Token,
  TokenListObserver,
  TokenListObserverDelegate,
  parseTokenString,
} from "../mutation-observers/token_list_observer"
import { AriaAttributeName, AriaPropertyName, ariaMapping, isAriaAttributeName, forEachAriaMapping } from "./aria"

export interface AriaElementObserverDelegate {
  ariaElementConnected(element: Element, attributeName: AriaAttributeName, propertyName: AriaPropertyName): void
  ariaElementDisconnected(element: Element, attributeName: AriaAttributeName, propertyName: AriaPropertyName): void
}

export class AriaElementObserver implements ElementObserverDelegate, TokenListObserverDelegate {
  readonly delegate: AriaElementObserverDelegate
  readonly element: Element
  readonly root: Document
  readonly elementObserver: ElementObserver
  readonly tokenListObservers: TokenListObserver[] = []
  readonly elementsByAttributeName = new Multimap<AriaAttributeName, Element>()

  constructor(element: Element, root: Document, delegate: AriaElementObserverDelegate) {
    this.delegate = delegate
    this.element = element
    this.root = root

    this.elementObserver = new ElementObserver(root.body, this)
    forEachAriaMapping((attributeName) => {
      this.tokenListObservers.push(new TokenListObserver(element, attributeName, this))
    })
  }

  start() {
    if (this.elementObserver.started) return

    this.elementObserver.start()
    for (const observer of this.tokenListObservers) observer.start()
  }

  stop() {
    if (this.elementObserver.started) {
      this.disconnectAllElements()
      for (const observer of this.tokenListObservers) observer.stop()
      this.elementObserver.stop()
    }
  }

  // Element observer delegate

  matchElement(element: Element) {
    return element.hasAttribute("id")
  }

  matchElementsInTree(tree: Element) {
    const match = this.matchElement(tree) ? [tree] : []
    const matches = Array.from(tree.querySelectorAll("[id]"))
    return match.concat(matches)
  }

  elementMatched(element: Element) {
    forEachAriaMapping((attributeName) => {
      const tokens = this.element.getAttribute(attributeName) || ""
      for (const token of parseTokenString(tokens, this.element, attributeName)) {
        if (token.content == element.id) this.connectAriaElement(element, attributeName)
      }
    })
  }

  elementUnmatched(element: Element) {
    forEachAriaMapping((attributeName, propertyName) => {
      const tokens = this.element.getAttribute(attributeName) || ""
      for (const token of parseTokenString(tokens, this.element, attributeName)) {
        if (token.content == element.id) this.disconnectAriaElement(element, attributeName, propertyName)
      }
    })
  }

  elementAttributeChanged() {}

  // Token list observer delegate

  tokenMatched({ element, attributeName, content }: Token) {
    if (element == this.element && isAriaAttributeName(attributeName)) {
      const relatedElement = this.root.getElementById(content)

      if (relatedElement) this.connectAriaElement(relatedElement, attributeName)
    }
  }

  tokenUnmatched({ element, attributeName, content }: Token) {
    if (element == this.element && isAriaAttributeName(attributeName)) {
      const relatedElement = this.root.getElementById(content)

      if (relatedElement) this.disconnectAriaElement(relatedElement, attributeName, ariaMapping[attributeName])
    }
  }

  private connectAriaElement(element: Element, attributeName: AriaAttributeName) {
    if (!this.elementsByAttributeName.has(attributeName, element)) {
      this.elementsByAttributeName.add(attributeName, element)
      this.delegate.ariaElementConnected(element, attributeName, ariaMapping[attributeName])
    }
  }

  private disconnectAriaElement(element: Element, attributeName: AriaAttributeName, propertyName: AriaPropertyName) {
    if (this.elementsByAttributeName.has(attributeName, element)) {
      this.elementsByAttributeName.delete(attributeName, element)
      this.delegate.ariaElementDisconnected(element, attributeName, propertyName)
    }
  }

  private disconnectAllElements() {
    for (const attributeName of this.elementsByAttributeName.keys) {
      for (const element of this.elementsByAttributeName.getValuesForKey(attributeName)) {
        this.disconnectAriaElement(element, attributeName, ariaMapping[attributeName])
      }
    }
  }
}
