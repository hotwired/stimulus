import { Action } from "./action"
import { ErrorHandler } from "./error_handler"
import { Schema } from "./schema"
import { Token, TokenObserver, TokenObserverDelegate, TokenSource } from "@stimulus/mutation-observers"

export interface ActionObserverDelegate extends ErrorHandler {
  actionConnected(action: Action)
  actionDisconnected(action: Action)
}

export class ActionObserver implements TokenObserverDelegate<Action> {
  readonly element: Element
  readonly schema: Schema
  private delegate: ActionObserverDelegate
  private tokenObserver: TokenObserver<Action>

  constructor(element: Element, schema: Schema, delegate: ActionObserverDelegate) {
    this.element = element
    this.schema = schema
    this.delegate = delegate
    this.tokenObserver = new TokenObserver(element, this.actionAttribute, this)
  }

  start() {
    this.tokenObserver.start()
  }

  stop() {
    this.tokenObserver.stop()
  }

  get actionAttribute() {
    return this.schema.actionAttribute
  }

  // Token observer delegate

  /** @private */
  parseValueFromTokenSource(source: TokenSource): Action {
    return Action.forElementWithDescriptorString(source.element, source.value)
  }

  /** @private */
  handleErrorParsingTokenSource(error: Error, source: TokenSource) {
    const location = `<${source.element.tagName.toLowerCase()} ${source.attributeName}>`
    this.delegate.handleError(error, `parsing action descriptor "${source.value}" in ${location}`, source)
  }

  /** @private */
  elementMatchedToken(token: Token<Action>) {
    this.delegate.actionConnected(token.value)
  }

  /** @private */
  elementUnmatchedToken(token: Token<Action>) {
    this.delegate.actionDisconnected(token.value)
  }
}
