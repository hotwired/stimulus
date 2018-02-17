import { Action } from "./action"
import { ActionDescriptor } from "./action_descriptor"
import { Context } from "./context"
import { Multimap } from "@stimulus/multimap"
import { Schema } from "./schema"
import { Scope } from "./scope"
import { TokenListObserver, TokenListObserverDelegate } from "@stimulus/mutation-observers"

export interface InlineActionObserverDelegate {
  inlineActionConnected(action: Action)
  inlineActionDisconnected(action: Action)
}

export class InlineActionObserver implements TokenListObserverDelegate {
  readonly context: Context
  readonly delegate: InlineActionObserverDelegate
  private tokenListObserver: TokenListObserver
  private connectedActions: Multimap<Element, Action>

  constructor(context: Context, delegate: InlineActionObserverDelegate) {
    this.context = context
    this.delegate = delegate
    this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this)
    this.connectedActions = new Multimap<Element, Action>()
  }

  get scope(): Scope {
    return this.context.scope
  }

  get schema(): Schema {
    return this.context.schema
  }

  get attributeName(): string {
    return this.schema.actionAttribute
  }

  get element(): Element {
    return this.scope.element
  }

  get identifier(): string {
    return this.scope.identifier
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  // Token list observer delegate

  /** @private */
  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    if (this.scope.containsElement(element)) {
      const action = this.buildActionForElementWithDescriptorString(element, token)
      if (action) {
        this.connectedActions.add(element, action)
        this.delegate.inlineActionConnected(action)
      }
    }
  }

  /** @private */
  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    const action = this.getConnectedActionForElementWithDescriptorString(element, token)
    if (action) {
      this.connectedActions.delete(element, action)
      this.delegate.inlineActionDisconnected(action)
    }
  }

  private getConnectedActionForElementWithDescriptorString(element: Element, descriptorString: string) {
    const newAction = this.buildActionForElementWithDescriptorString(element, descriptorString)
    if (newAction) {
      const actions = this.connectedActions.getValuesForKey(element)
      return actions.find(action => action.hasSameDescriptorAs(newAction))
    }
  }

  private buildActionForElementWithDescriptorString(element: Element, descriptorString: string) {
    try {
      const descriptor = ActionDescriptor.forElementWithInlineDescriptorString(element, descriptorString)
      if (descriptor.identifier == this.identifier) {
        return new Action(this.context, descriptor)
      }
    } catch (error) {
      this.context.handleError(error, `parsing descriptor string "${descriptorString}"`, { element })
    }
  }
}
