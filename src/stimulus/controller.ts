import { Action } from "./action"
import { Descriptor } from "./descriptor"
import { Dispatcher } from "./dispatcher"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { TargetSet, TargetSetDelegate } from "./target_set"

export interface ControllerConstructor {
  new(identifier: string, element: Element, delegate: ControllerDelegate): Controller
}

export interface ControllerDelegate {
  controllerCanControlElement(controller: Controller, element: Element): boolean
}

export class Controller implements InlineActionObserverDelegate, TargetSetDelegate {
  identifier: string
  element: Element
  delegate: ControllerDelegate

  targets: TargetSet
  private dispatcher: Dispatcher
  private inlineActionObserver: InlineActionObserver

  constructor(identifier: string, element: Element, delegate: ControllerDelegate) {
    this.identifier = identifier
    this.element = element
    this.delegate = delegate

    this.targets = new TargetSet(identifier, element, this)
    this.dispatcher = new Dispatcher(this)
    this.inlineActionObserver = new InlineActionObserver(identifier, element, this)

    this.initialize()
  }

  initialize() {
  }

  beforeConnect() {
    this.inlineActionObserver.start()
  }

  connect() {
  }

  disconnect() {
  }

  afterDisconnect() {
    this.inlineActionObserver.stop()
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  // Actions

  addAction(action: Action) {
    this.dispatcher.addAction(action)
  }

  removeAction(action: Action) {
    this.dispatcher.removeAction(action)
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

  // Inline action observer & target set delegate

  canControlElement(element: Element): boolean {
    return this.delegate.controllerCanControlElement(this, element)
  }
}
