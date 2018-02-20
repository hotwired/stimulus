import { ErrorHandler } from "./error_handler"
import { Schema } from "./schema"
import { Scope } from "./scope"
import { Token, TokenObserver, TokenObserverDelegate, TokenSource } from "@stimulus/mutation-observers"

export interface ScopeObserverDelegate extends ErrorHandler {
  scopeConnected(scope: Scope)
  scopeDisconnected(scope: Scope)
}

export class ScopeObserver implements TokenObserverDelegate<Scope> {
  readonly element: Element
  readonly schema: Schema
  private delegate: ScopeObserverDelegate
  private tokenObserver: TokenObserver<Scope>

  constructor(element: Element, schema: Schema, delegate: ScopeObserverDelegate) {
    this.element = element
    this.schema = schema
    this.delegate = delegate
    this.tokenObserver = new TokenObserver(this.element, this.controllerAttribute, this)
  }

  start() {
    this.tokenObserver.start()
  }

  stop() {
    this.tokenObserver.stop()
  }

  get controllerAttribute() {
    return this.schema.controllerAttribute
  }

  // Token observer delegate

  /** @private */
  parseValueFromTokenSource(source: TokenSource): Scope {
    return new Scope(this.schema, source.value, source.element)
  }

  /** @private */
  elementMatchedToken(token: Token<Scope>) {
    this.delegate.scopeConnected(token.value)
  }

  /** @private */
  elementUnmatchedToken(token: Token<Scope>) {
    this.delegate.scopeDisconnected(token.value)
  }
}
