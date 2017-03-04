import { Action } from "./action"
import { ActionObserver, ActionObserverDelegate } from "./action_observer"
import { TargetSet } from "./target_set"

export interface ControllerConstructor {
  new(identifier: string, element: Element): Controller
}

export class Controller implements ActionObserverDelegate {
  identifier: string
  element: Element
  targets: TargetSet

  private actionObserver: ActionObserver
  private actionsByElement: Map<Element, Action>

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.element = element
    this.targets = new TargetSet(identifier, element)

    this.actionObserver = new ActionObserver(identifier, element, this)
    this.actionsByElement = new Map<Element, Action>()
    this.handleDelegatedEvent = this.handleDelegatedEvent.bind(this)

    this.initialize()
  }

  initialize() {
  }

  connect() {
    this.actionObserver.start()
  }

  disconnect() {
    this.actionObserver.stop()
  }

  get actions(): Action[] {
    return Array.from(this.actionsByElement, ([element, action]) => action)
  }

  // Action observer delegate

  actionConnected(action: Action) {
    const {element, eventName} = action
    this.actionsByElement.set(element, action)
    if (this.getActionsForEventName(eventName).length == 1) {
      this.element.addEventListener(eventName, this.handleDelegatedEvent, false)
    }
  }

  actionDisconnected(action: Action) {
    const {element, eventName} = action
    this.actionsByElement.delete(element)
    if (this.getActionsForEventName(eventName).length == 0) {
      this.element.removeEventListener(eventName, this.handleDelegatedEvent, false)
    }
  }

  private getActionsForEventName(eventName: string): Action[] {
    return this.actions.filter((action) => action.eventName == eventName)
  }

  private handleDelegatedEvent(event: Event) {
    const element = elementForEventTarget(event.target)
    if (element) {
      const action = this.findActionForElement(element)
      if (action) {
        event.preventDefault()
        this.performActionWithEvent(action, event)
      }
    }
  }

  private findActionForElement(element: Element): Action | undefined {
    let currentElement: Element | null = element
    while (currentElement) {
      const action = this.actionsByElement.get(element)
      if (action) {
        return action
      } else {
        currentElement = currentElement.parentElement
      }
    }
  }

  private performActionWithEvent(action: Action, event: Event) {
    const method = this[action.methodName]
    if (typeof method == "function") {
      method.call(this, event, action)
    }
  }
}

function elementForEventTarget(eventTarget: EventTarget) {
  if (eventTarget instanceof Node) {
    return elementForNode(eventTarget)
  }
}

function elementForNode(node: Node) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    return <Element> node
  } else {
    return node.parentElement
  }
}
