import { Action } from "./action"
import { ErrorHandler } from "./error_handler"
import { Schema } from "./schema"
import { Token, ValueObserver, ValueObserverDelegate } from "@stimulus/mutation-observers"

export interface ActionObserverDelegate extends ErrorHandler {
  actionConnected(action: Action)
  actionDisconnected(action: Action)
}

export class ActionObserver implements ValueObserverDelegate<Action> {
  readonly element: Element
  readonly schema: Schema
  private delegate: ActionObserverDelegate
  private valueObserver: ValueObserver<Action>

  constructor(element: Element, schema: Schema, delegate: ActionObserverDelegate) {
    this.element = element
    this.schema = schema
    this.delegate = delegate
    this.valueObserver = new ValueObserver(element, this.actionAttribute, this)
  }

  start() {
    this.valueObserver.start()
  }

  stop() {
    this.valueObserver.stop()
  }

  get actionAttribute() {
    return this.schema.actionAttribute
  }

  // Value observer delegate

  parseValueForToken(token: Token): Action | undefined {
    return Action.forToken(token)
  }

  elementMatchedValue(element: Element, value: Action) {
    this.delegate.actionConnected(value)
  }

  elementUnmatchedValue(element: Element, value: Action) {
    this.delegate.actionDisconnected(value)
  }
}
