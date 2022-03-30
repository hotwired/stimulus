import { Action } from "./action"
import { Binding } from "./binding"
import { Context } from "./context"
import { ErrorHandler } from "./error_handler"
import { Schema } from "./schema"
import { Token, ValueListObserver, ValueListObserverDelegate } from "../mutation-observers"

export interface BindingObserverDelegate extends ErrorHandler {
  bindingConnected(binding: Binding): void
  bindingDisconnected(binding: Binding): void
}

export class BindingObserver implements ValueListObserverDelegate<Action> {
  readonly context: Context
  private delegate: BindingObserverDelegate
  private valueListObserver?: ValueListObserver<Action>
  private bindingsByAction: Map<Action, Binding>

  constructor(context: Context, delegate: BindingObserverDelegate) {
    this.context = context
    this.delegate = delegate
    this.bindingsByAction = new Map
  }

  start() {
    if (!this.valueListObserver) {
      this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this)
      this.valueListObserver.start()
    }
  }

  stop() {
    if (this.valueListObserver) {
      this.valueListObserver.stop()
      delete this.valueListObserver
      this.disconnectAllActions()
    }
  }

  get element() {
    return this.context.element
  }

  get identifier() {
    return this.context.identifier
  }

  get actionAttribute() {
    return this.schema.actionAttribute
  }

  get schema(): Schema {
    return this.context.schema
  }

  get bindings(): Binding[] {
    return Array.from(this.bindingsByAction.values())
  }

  private connectAction(action: Action) {
    const binding = new Binding(this.context, action)
    const { controller } = binding.context
    const method = (controller as any)[action.methodName]

    this.bindingsByAction.set(action, binding)
    this.delegate.bindingConnected(binding)

    if (typeof method != "function") {
      this.context.handleWarning(
        `Action "${action.toString()}" references undefined method "${action.methodName}" on controller "${action.identifier}"`,
        `connecting action "${action.toString()}"`
      )
    }
  }

  private disconnectAction(action: Action) {
    const binding = this.bindingsByAction.get(action)
    if (binding) {
      this.bindingsByAction.delete(action)
      this.delegate.bindingDisconnected(binding)
    }
  }

  private disconnectAllActions() {
    this.bindings.forEach(binding => this.delegate.bindingDisconnected(binding))
    this.bindingsByAction.clear()
  }

  // Value observer delegate

  parseValueForToken(token: Token): Action | undefined {
    const action = Action.forToken(token, this.schema)
    if (action.identifier == this.identifier) {
      return action
    }
  }

  elementMatchedValue(element: Element, action: Action) {
    this.connectAction(action)
  }

  elementUnmatchedValue(element: Element, action: Action) {
    this.disconnectAction(action)
  }

  elementMatchedNoValue(token: Token) {
    const action = Action.forToken(token, this.schema)
    this.context.handleWarning(
      `Action "${token.content}" references undefined controller "${action.identifier}"`,
      `connecting action "${token.content}"`
    )
  }
}
