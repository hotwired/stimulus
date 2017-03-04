import { Action } from "./action"
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

  private inlineActionObserver: InlineActionObserver
  private actionsByEventTarget: Map<EventTarget, Action>

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.element = element
    this.targets = new TargetSet(identifier, element)

    this.inlineActionObserver = new InlineActionObserver(identifier, element, this)
    this.actionsByEventTarget = new Map<EventTarget, Action>()
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

  get actions(): Action[] {
    return Array.from(this.actionsByEventTarget, ([element, action]) => action)
  }

  // Inline action observer delegate

  getObjectForInlineActionDescriptor(descriptor: Descriptor): object {
    return this
  }

  inlineActionConnected(action: Action) {
    const {eventTarget, eventName} = action
    this.actionsByEventTarget.set(eventTarget, action)
    if (this.getActionsForEventName(eventName).length == 1) {
      this.element.addEventListener(eventName, this.handleDelegatedEvent, false)
    }
  }

  inlineActionDisconnected(action: Action) {
    const {eventTarget, eventName} = action
    this.actionsByEventTarget.delete(eventTarget)
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
      const action = this.actionsByEventTarget.get(element)
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
