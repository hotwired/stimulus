import { Action } from "./action"
import { Context } from "./context"
import { Descriptor } from "./descriptor"
import { AttributeObserver, AttributeObserverDelegate } from "sentinella"

export interface InlineActionObserverDelegate {
  inlineActionConnected(action: Action)
  inlineActionDisconnected(action: Action)
}

export class InlineActionObserver implements AttributeObserverDelegate {
  context: Context
  delegate: InlineActionObserverDelegate

  private attributeObserver: AttributeObserver
  private connectedActions: Map<Element, Action>

  constructor(context: Context, delegate: InlineActionObserverDelegate) {
    this.context = context
    this.delegate = delegate

    this.attributeObserver = new AttributeObserver(this.element, this.attributeName, this)
    this.connectedActions = new Map<Element, Action>()
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
    this.attributeObserver.start()
  }

  stop() {
    this.attributeObserver.stop()
  }

  // Attribute observer delegate

  elementMatchedAttribute(element: Element, attributeName: string) {
    if (this.context.canControlElement(element)) {
      this.refreshActionForElement(element)
    }
  }

  elementAttributeValueChanged(element: Element, attributeName: string) {
    if (this.context.canControlElement(element)) {
      this.refreshActionForElement(element)
    }
  }

  elementUnmatchedAttribute(element: Element, attributeName: string) {
    this.disconnectActionForElement(element)
  }

  // Connected actions

  private refreshActionForElement(element: Element) {
    const descriptorString = element.getAttribute(this.attributeName)
    if (descriptorString == null || descriptorString.trim().length == 0) {
      this.disconnectActionForElement(element)
    } else {
      const newAction = this.buildActionForElementWithDescriptorString(element, descriptorString)
      if (newAction) {
        const existingAction = this.getActionForElement(element)
        if (!newAction.hasSameDescriptorAs(existingAction)) {
          this.disconnectActionForElement(element)
          this.connectActionForElement(newAction, element)
        }
      } else {
        this.disconnectActionForElement(element)
      }
    }
  }

  private connectActionForElement(action: Action, element: Element) {
    this.connectedActions.set(element, action)
    this.delegate.inlineActionConnected(action)
  }

  private disconnectActionForElement(element: Element) {
    const action = this.getActionForElement(element)
    if (action) {
      this.connectedActions.delete(element)
      this.delegate.inlineActionDisconnected(action)
    }
  }

  private getActionForElement(element: Element): Action | null {
    return this.connectedActions.get(element) || null
  }

  private buildActionForElementWithDescriptorString(element: Element, descriptorString: string) {
    try {
      const descriptor = Descriptor.forElementWithInlineDescriptorString(element, descriptorString)
      if (descriptor.identifier == this.identifier) {
        return new Action(this.context, descriptor, this.element, eventTarget => eventTarget == element)
      }
    } catch (error) {
      this.context.error(error, "while parsing descriptor string for element", element)
    }
  }
}
