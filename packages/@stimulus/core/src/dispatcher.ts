import { Action } from "./action"
import { ActionSet } from "./action_set"
import { Context } from "./context"
import { EventSet } from "./event_set"
import { Scope } from "./scope"

type ActionInvocation = [Action, Event, EventTarget]

export class Dispatcher {
  context: Context
  started: boolean

  private directActions: ActionSet
  private delegatedActions: ActionSet
  private events: EventSet

  constructor(context: Context) {
    this.context = context
    this.started = false

    this.directActions = new ActionSet()
    this.delegatedActions = new ActionSet()
    this.events = new EventSet()

    this.handleDirectEvent = this.handleDirectEvent.bind(this)
    this.handleDelegatedEvent = this.handleDelegatedEvent.bind(this)
  }

  start() {
    if (!this.started) {
      this.started = true
      this.addEventListeners()
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
    if (this.started) {
      const eventListener = this.getEventListenerForAction(action)
      this.events.add(action.eventName, action.eventTarget, eventListener, false)
    }
  }

  private removeEventListenerForAction(action: Action) {
    if (this.started) {
      const eventListener = this.getEventListenerForAction(action)
      this.events.delete(action.eventName, action.eventTarget, eventListener, false)
    }
  }

  private getEventListenerForAction(action: Action): EventListener {
    return action.isDirect ? this.handleDirectEvent : this.handleDelegatedEvent
  }

  private handleDirectEvent(event: Event) {
    if (this.canHandleEvent(event)) {
      const actionInvocations = this.findDirectActionInvocationsForEvent(event)
      this.performActionInvocations(actionInvocations)
    }
  }

  private handleDelegatedEvent(event: Event) {
    if (this.canHandleEvent(event)) {
      const actionInvocations = this.findDelegatedActionInvocationsForEvent(event)
      this.performActionInvocations(actionInvocations)
    }
  }

  private canHandleEvent(event: Event): boolean {
    const element = getTargetElementForEvent(event)
    if (element) {
      return this.scope.containsElement(element)
    } else {
      return true
    }
  }

  private findDirectActionInvocationsForEvent(event: Event): ActionInvocation[] {
    const actions = this.directActions.getActionsForEventName(event.type)
    const eventTarget = event.currentTarget
    const result: ActionInvocation[] = []
    for (const action of actions) {
      if (action.eventTarget == eventTarget) {
        result.push([action, event, eventTarget])
      }
    }
    return result
  }

  private findDelegatedActionInvocationsForEvent(event: Event): ActionInvocation[] {
    const actions = this.delegatedActions.getActionsForEventName(event.type)
    const elements = this.getPathForEvent(event)
    const result: ActionInvocation[] = []
    for (const element of elements) {
      for (const action of actions) {
        if (action.matchDelegatedTarget(element)) {
          result.push([action, event, element])
        }
      }
    }
    return result
  }

  private performActionInvocations(actionInvocations: ActionInvocation[]) {
    for (const [action, event, eventTarget] of actionInvocations) {
      action.invokeWithEventAndTarget(event, eventTarget)
    }
  }

  private getPathForEvent(event: Event): Element[] {
    const elements: Element[] = []
    let element = getTargetElementForEvent(event)
    while (element && element != this.parentElement) {
      elements.push(element)
      element = element.parentElement
    }
    return elements
  }

  private get scope() {
    return this.context.scope
  }

  private get parentElement() {
    return this.context.parentElement
  }
}

function getTargetElementForEvent(event: Event): Element | null {
  const target = event.target
  if (target instanceof Element) {
    return target
  } else if (target instanceof Node) {
    return target.parentElement
  } else {
    return null
  }
}
