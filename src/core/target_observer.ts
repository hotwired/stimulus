import { Multimap } from "../multimap"
import { ElementObserver, ElementObserverDelegate, Token, TokenListObserver, TokenListObserverDelegate } from "../mutation-observers"
import { Context } from "./context"

export interface TargetObserverDelegate {
  targetConnected(element: Element, name: string): void
  targetDisconnected(element: Element, name: string): void
  targetAttributeChanged(element: Element, name: string, attributeName: string, oldValue: string | null, newValue: string | null): void
}

export class TargetObserver implements ElementObserverDelegate, TokenListObserverDelegate {
  readonly context: Context
  readonly delegate: TargetObserverDelegate
  readonly targetsByName: Multimap<string, Element>
  private tokenListObserver?: TokenListObserver
  private elementObserver?: ElementObserver

  constructor(context: Context, delegate: TargetObserverDelegate) {
    this.context = context
    this.delegate = delegate
    this.targetsByName = new Multimap
  }

  start() {
    if (!this.tokenListObserver) {
      this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this)
      this.tokenListObserver.start()
    }
    if (!this.elementObserver) {
      this.elementObserver = new ElementObserver(this.element, this, { attributeOldValue: true })
      this.elementObserver.start()
    }
  }

  stop() {
    if (this.tokenListObserver) {
      this.disconnectAllTargets()
      this.tokenListObserver.stop()
      delete this.tokenListObserver
    }
    if (this.elementObserver) {
      this.elementObserver.stop()
      delete this.elementObserver
    }
  }

  // Token list observer delegate

  tokenMatched({ element, content: name }: Token) {
    if (this.scope.containsElement(element)) {
      this.connectTarget(element, name)
    }
  }

  tokenUnmatched({ element, content: name }: Token) {
    this.disconnectTarget(element, name)
  }

  // Element observer delegate

  matchElement(element: Element) {
    return this.targetsByName.hasValue(element)
  }

  matchElementsInTree(tree: Element) {
    return this.targetsByName.values
  }

  elementAttributeChanged(element: Element, attributeName: string, mutationRecord: MutationRecord) {
    for (const name of this.targetsByName.getKeysForValue(element)) {
      this.mutateTarget(element, name, attributeName, mutationRecord)
    }
  }

  // Target management

  connectTarget(element: Element, name: string) {
    if (!this.targetsByName.has(name, element)) {
      this.targetsByName.add(name, element)
      this.tokenListObserver?.pause(() => this.delegate.targetConnected(element, name))
    }
  }

  disconnectTarget(element: Element, name: string) {
    if (this.targetsByName.has(name, element)) {
      this.targetsByName.delete(name, element)
      this.tokenListObserver?.pause(() => this.delegate.targetDisconnected(element, name))
    }
  }

  disconnectAllTargets() {
    for (const name of this.targetsByName.keys) {
      for (const element of this.targetsByName.getValuesForKey(name)) {
        this.disconnectTarget(element, name)
      }
    }
  }

  mutateTarget(element: Element, name: string, attributeName: string, { oldValue }: MutationRecord) {
    const newValue = element.getAttribute(attributeName)

    this.elementObserver?.pause(() => {
      this.delegate.targetAttributeChanged(element, name, attributeName, oldValue, newValue)
    })
  }

  // Private

  private get attributeName() {
    return `data-${this.context.identifier}-target`
  }

  private get element() {
    return this.context.element
  }

  private get scope() {
    return this.context.scope
  }
}
