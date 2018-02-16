import { ErrorHandler } from "./error_handler"
import { Multimap } from "@stimulus/multimap"
import { Schema } from "./schema"
import { Scope } from "./scope"
import { Token, TokenObserver, TokenObserverDelegate, TokenSource } from "@stimulus/mutation-observers"

export interface ScopeObserverDelegate extends ErrorHandler {
  scopeConnected(scope: Scope)
  scopeDisconnected(scope: Scope)
}

export class ScopeObserver implements TokenObserverDelegate<string> {
  readonly element: Element
  readonly schema: Schema
  private delegate: ScopeObserverDelegate
  private tokenObserver: TokenObserver<string>
  private scopesByElement: Multimap<Element, Scope>

  constructor(element: Element, schema: Schema, delegate: ScopeObserverDelegate) {
    this.element = element
    this.schema = schema
    this.delegate = delegate
    this.tokenObserver = new TokenObserver(this.element, this.controllerAttribute, this)
    this.scopesByElement = new Multimap
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
  parseValueFromTokenSource(source: TokenSource): string {
    return source.value
  }

  /** @private */
  handleErrorParsingTokenSource(error: Error, source: TokenSource) {
    const location = `<${source.element.tagName.toLowerCase()} ${source.attributeName}>`
    this.delegate.handleError(error, `Error parsing token "${source.value}" in ${location}`, source)
  }

  /** @private */
  elementMatchedToken(token: Token<string>) {
    const scope = this.fetchScopeForToken(token)
    this.delegate.scopeConnected(scope)
  }

  /** @private */
  elementUnmatchedToken(token: Token<string>) {
    const scope = this.getScopeForToken(token)
    if (scope) {
      this.deleteScopeForToken(token)
      this.delegate.scopeDisconnected(scope)
    }
  }

  // Scope management

  private getScopesForElement(element: Element): Scope[] {
    return this.scopesByElement.getValuesForKey(element)
  }

  private fetchScopeForToken(token: Token<string>): Scope {
    let scope = this.getScopeForToken(token)
    if (!scope) {
      scope = new Scope(this.schema, token.value, token.source.element)
      this.scopesByElement.add(token.source.element, scope)
    }
    return scope
  }

  private getScopeForToken(token: Token<string>): Scope | undefined {
    const scopes = this.getScopesForElement(token.source.element)
    return scopes.find(scope => scope.identifier == token.value)
  }

  private deleteScopeForToken(token: Token<string>) {
    const scope = this.getScopeForToken(token)
    if (scope) {
      this.scopesByElement.delete(token.source.element, scope)
    }
  }
}
