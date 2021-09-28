import { Multimap } from "../multimap"
import { Token, TokenListObserver, TokenListObserverDelegate } from "../mutation-observers"
import { Context } from "./context"

export interface TargetObserverDelegate {
  targetConnected(element: Element, name: string): void
  targetDisconnected(element: Element, name: string): void
}

export class TargetObserver implements TokenListObserverDelegate {
  readonly context: Context
  readonly delegate: TargetObserverDelegate
  readonly targetsByName: Multimap<string, Element>
  private tokenListObserver?: TokenListObserver

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
  }

  stop() {
    if (this.tokenListObserver) {
      this.disconnectAllTargets()
      this.tokenListObserver.stop()
      delete this.tokenListObserver
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
