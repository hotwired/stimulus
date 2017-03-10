import { Action } from "./action"
import { ActionSet } from "./action_set"
import { Controller } from "./controller"

export class Dispatcher {
  controller: Controller
  started: boolean

  private directActions: ActionSet
  private delegatedActions: ActionSet

  constructor(controller: Controller) {
    this.controller = controller
    this.started = false

    this.directActions = new ActionSet()
    this.delegatedActions = new ActionSet()

    this.handleDirectEvent = this.handleDirectEvent.bind(this)
    this.handleDelegatedEvent = this.handleDelegatedEvent.bind(this)
  }

  start() {
    if (!this.started) {
      this.addEventListeners()
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      this.removeEventListeners()
      this.started = false
    }
  }

  // Action registration

  addAction(action: Action) {
    const actionSet = this.getActionSetForAction(action)
    if (!actionSet.has(action)) {
      this.addEventListenerForAction(action)
      actionSet.add(action)
    }
  }

  removeAction(action: Action) {
    const actionSet = this.getActionSetForAction(action)
    if (actionSet.has(action)) {
      this.removeEventListenerForAction(action)
      actionSet.delete(action)
    }
  }

  private getActionSetForAction(action: Action) {
    return action.isDirect ? this.directActions : this.delegatedActions
  }

  private hasRelatedActionsForAction(action: Action): boolean {
    return this.getRelatedActionsForAction(action).length > 0
  }

  private getRelatedActionsForAction(action: Action): Action[] {
    const actionSet = this.getActionSetForAction(action)
    const actions = actionSet.getActionsForCurrentTargetAndEventName(action.currentTarget, action.eventName)
    return actions.filter(a => a != action)
  }

  // Event listeners

  private addEventListeners() {
    this.addEventListenersForActionSet(this.directActions)
    this.addEventListenersForActionSet(this.delegatedActions)
  }

  private removeEventListeners() {
    this.removeEventListenersForActionSet(this.delegatedActions)
    this.removeEventListenersForActionSet(this.directActions)
  }

  private addEventListenersForActionSet(actionSet: ActionSet) {
    for (const action of actionSet.actions) {
      this.addEventListenerForAction(action)
    }
  }

  private removeEventListenersForActionSet(actionSet: ActionSet) {
    for (const action of actionSet.actions) {
      this.removeEventListenerForAction(action)
    }
  }

  private addEventListenerForAction(action: Action) {
    if (!this.hasRelatedActionsForAction(action)) {
      const eventListener = this.getEventListenerForAction(action)
      action.currentTarget.addEventListener(action.eventName, eventListener, false)
    }
  }

  private removeEventListenerForAction(action: Action) {
    if (!this.hasRelatedActionsForAction(action)) {
      const eventListener = this.getEventListenerForAction(action)
      action.currentTarget.removeEventListener(action.eventName, eventListener, false)
    }
  }

  private getEventListenerForAction(action: Action): EventListener {
    return action.isDirect ? this.handleDirectEvent : this.handleDelegatedEvent
  }

  private handleDirectEvent(event: Event) {
    const actions = this.directActions.getActionsForCurrentTargetAndEventName(event.currentTarget, event.type)
    performActionsWithEvent(actions, event)
  }

  private handleDelegatedEvent(event: Event) {
    const element = getElementForEventTarget(event.target)
    if (element) {
      const actions = this.findClosestDelegatedActionsForElementAndEventName(element, event.type)
      performActionsWithEvent(actions, event)
    }
  }

  private findClosestDelegatedActionsForElementAndEventName(element: Element, eventName: string): Action[] {
    const parentElement = this.controller.parentElement
    let currentElement: Element | null = element
    while (currentElement && currentElement != parentElement) {
      const actions = this.delegatedActions.getActionsForEventTargetAndEventName(element, eventName)
      if (actions.length > 0) {
        return actions
      } else {
        currentElement = currentElement.parentElement
      }
    }
    return []
  }
}

function performActionsWithEvent(actions: Action[], event: Event) {
  for (const action of actions) {
    action.performWithEvent(event)
    if (!action.allowsDefault) {
      event.preventDefault()
    }
  }
}

function getElementForEventTarget(eventTarget: EventTarget) {
  if (eventTarget instanceof Node) {
    return getElementForNode(eventTarget)
  }
}

function getElementForNode(node: Node) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    return <Element> node
  } else {
    return node.parentElement
  }
}
