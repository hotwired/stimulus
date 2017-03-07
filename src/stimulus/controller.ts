import { Action } from "./action"
import { ActionSet } from "./action_set"
import { Descriptor } from "./descriptor"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { TargetSet } from "./target_set"

export interface ControllerConstructor {
  new(identifier: string, element: Element): Controller
}

export class Controller implements InlineActionObserverDelegate {
  identifier: string
  element: Element
  targets: TargetSet

  // TODO: directActions should be a WeakMap<EventTarget, ActionSet>, and direct
  // event listeners should be installed/uninstalled on connect/disconnect

  private directActions: ActionSet
  private delegatedActions: ActionSet
  private inlineActionObserver: InlineActionObserver

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.element = element
    this.targets = new TargetSet(identifier, element)

    this.directActions = new ActionSet()
    this.delegatedActions = new ActionSet()
    this.inlineActionObserver = new InlineActionObserver(identifier, element, this)

    this.handleDirectEvent = this.handleDirectEvent.bind(this)
    this.handleDelegatedEvent = this.handleDelegatedEvent.bind(this)
    this.initialize()
  }

  initialize() {
  }

  connect() {
    this.inlineActionObserver.start()
  }

  disconnect() {
    this.inlineActionObserver.stop()
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  // Inline action observer delegate

  getObjectForInlineActionDescriptor(descriptor: Descriptor): object {
    return this
  }

  inlineActionConnected(action: Action) {
    this.addAction(action)
  }

  inlineActionDisconnected(action: Action) {
    this.removeAction(action)
  }

  // Actions

  addAction(action: Action) {
    const actionSet = this.getActionSetForAction(action)
    if (!actionSet.has(action)) {
      const firstActionOfEventType = !actionSet.hasActionsForEventName(action.eventName)
      actionSet.add(action)

      if (firstActionOfEventType) {
        this.addEventListenerForFirstAction(action)
      }
    }
  }

  removeAction(action: Action) {
    const actionSet = this.getActionSetForAction(action)
    if (actionSet.has(action)) {
      actionSet.delete(action)
      const lastActionOfEventType = !actionSet.hasActionsForEventName(action.eventName)

      if (lastActionOfEventType) {
        this.removeEventListenerForLastAction(action)
      }
    }
  }

  private getActionSetForAction(action: Action) {
    return action.isDirect ? this.directActions : this.delegatedActions
  }

  // Event handling

  private addEventListenerForFirstAction(action: Action) {
    console.log("addEventListenerForFirstAction", action)
    const eventTarget = this.getEventTargetForAction(action)
    const eventListener = this.getEventListenerForAction(action)
    eventTarget.addEventListener(action.eventName, eventListener, false)
  }

  private removeEventListenerForLastAction(action: Action) {
    console.log("removeEventListenerForLastAction", action)
    const eventTarget = this.getEventTargetForAction(action)
    const eventListener = this.getEventListenerForAction(action)
    eventTarget.removeEventListener(action.eventName, eventListener, false)
  }

  private getEventTargetForAction(action: Action): EventTarget {
    return action.isDirect ? action.eventTarget : this.element
  }

  private getEventListenerForAction(action: Action): EventListener {
    return action.isDirect ? this.handleDirectEvent : this.handleDelegatedEvent
  }

  private handleDirectEvent(event: Event) {
    const eventName = event.type
    const actions = this.directActions.getActionsForEventNameAndEventTarget(eventName, event.currentTarget)
    performActionsWithEvent(actions, event)
  }

  private handleDelegatedEvent(event: Event) {
    const eventName = event.type
    const element = getElementForEventTarget(event.target)

    if (element) {
      const actions = this.findClosestDelegatedActionsForEventNameAndElement(eventName, element)
      performActionsWithEvent(actions, event)
    }
  }

  private findClosestDelegatedActionsForEventNameAndElement(eventName: string, element: Element): Action[] {
    let currentElement: Element | null = element
    while (currentElement && currentElement != this.parentElement) {
      const actions = this.delegatedActions.getActionsForEventNameAndEventTarget(eventName, element)
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
