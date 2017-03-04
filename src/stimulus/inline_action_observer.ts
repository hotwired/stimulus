import { Action } from "./action"
import { Selector, AttributeObserver, AttributeObserverDelegate } from "sentinella"

export interface InlineActionObserverDelegate {
  inlineActionConnected(action: Action)
  inlineActionDisconnected(action: Action)
}

export class InlineActionObserver implements AttributeObserverDelegate {
  identifier: string
  private delegate: InlineActionObserverDelegate

  private attributeObserver: AttributeObserver
  private connectedActions: Map<Element, Action>

  constructor(identifier: string, element: Element, delegate: InlineActionObserverDelegate) {
    this.identifier = identifier
    this.delegate = delegate

    this.attributeObserver = new AttributeObserver(element, this.attributeName, this)
    this.connectedActions = new Map<Element, Action>()
  }

  get element(): Element {
    return this.attributeObserver.element
  }

  get attributeName(): string {
    return `data-${this.identifier}-action`
  }

  start() {
    this.attributeObserver.start()
  }

  stop() {
    this.attributeObserver.stop()
  }

  // Attribute observer delegate

  elementMatchedAttribute(element: Element, attributeName: string) {
    this.refreshActionForElement(element)
  }

  elementAttributeValueChanged(element: Element, attributeName: string) {
    this.refreshActionForElement(element)
  }

  elementUnmatchedAttribute(element: Element, attributeName: string) {
    this.disconnectActionForElement(element)
  }

  // Connected actions

  refreshActionForElement(element: Element) {
    const value = element.getAttribute(this.attributeName)
    if (value == null) {
      this.disconnectActionForElement(element)
    } else {
      const newAction = Action.parse(element, value)
      const existingAction = this.getActionForElement(element)
      if (!newAction.isEqualTo(existingAction)) {
        this.disconnectActionForElement(element)
        this.connectActionForElement(newAction, element)
      }
    }
  }

  connectActionForElement(action: Action, element: Element) {
    this.connectedActions.set(element, action)
    this.delegate.inlineActionConnected(action)
  }

  disconnectActionForElement(element: Element) {
    const action = this.getActionForElement(element)
    if (action) {
      this.connectedActions.delete(element)
      this.delegate.inlineActionDisconnected(action)
    }
  }

  getActionForElement(element: Element): Action | undefined {
    return this.connectedActions.get(element)
  }
}