import { Action } from "./action"
import { ActionDescriptor } from "./action_descriptor"
import { Context } from "./context"
import { Multimap } from "@stimulus/multimap"
import { TokenListObserver, TokenListObserverDelegate } from "@stimulus/mutation-observers"

export interface InlineActionObserverDelegate {
  inlineActionConnected(action: Action)
  inlineActionDisconnected(action: Action)
}

export class InlineActionObserver implements TokenListObserverDelegate {
  context: Context
  delegate: InlineActionObserverDelegate

  private tokenListObserver: TokenListObserver
  private connectedActions: Multimap<Element, Action>

  constructor(context: Context, delegate: InlineActionObserverDelegate) {
    this.context = context
    this.delegate = delegate

    this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this)
    this.connectedActions = new Multimap<Element, Action>()
  }

  get attributeName(): string {
    return this.context.actionAttribute
  }

  get element(): Element {
    return this.context.element
  }

  get identifier(): string {
    return this.context.identifier
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    if (this.context.canControlElement(element)) {
      const action = this.buildActionForElementWithDescriptorString(element, token)
      if (action) {
        this.connectedActions.add(element, action)
        this.delegate.inlineActionConnected(action)
      }
    }
  }

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
      return this.connectedActions.getValuesForKey(element).find(action => action.hasSameDescriptorAs(newAction))
    }
  }

  private buildActionForElementWithDescriptorString(element: Element, descriptorString: string) {
    try {
      const descriptor = ActionDescriptor.forElementWithInlineDescriptorString(element, descriptorString)
      if (descriptor.identifier == this.identifier) {
        return new Action(this.context, descriptor, this.element, eventTarget => eventTarget == element)
      }
    } catch (error) {
      this.context.error(error, "while parsing descriptor string for element", element)
    }
  }
}
