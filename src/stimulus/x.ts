import { Action } from "./action"
import { Controller, ControllerConstructor } from "./controller"
import { Descriptor } from "./descriptor"
import { Dispatcher } from "./dispatcher"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { TargetSet, TargetSetDelegate } from "./target_set"

export interface XDelegate {
  xCanControlElement(controller: X, element: Element): boolean
}

export class X implements InlineActionObserverDelegate, TargetSetDelegate {
  identifier: string
  element: Element
  delegate: XDelegate

  controller: Controller
  targets: TargetSet
  private dispatcher: Dispatcher
  private inlineActionObserver: InlineActionObserver

  constructor(identifier: string, element: Element, controllerConstructor: ControllerConstructor, delegate: XDelegate) {
    this.identifier = identifier
    this.element = element
    this.delegate = delegate

    this.targets = new TargetSet(identifier, element, this)
    this.dispatcher = new Dispatcher(this)
    this.inlineActionObserver = new InlineActionObserver(identifier, element, this)

    this.controller = new controllerConstructor(this)
    this.controller.initialize()
  }

  connect() {
    this.dispatcher.start()
    this.inlineActionObserver.start()
    this.controller.connect()
  }

  disconnect() {
    this.controller.disconnect()
    this.inlineActionObserver.stop()
    this.dispatcher.stop()
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
    return this.controller
  }

  inlineActionConnected(action: Action) {
    this.addAction(action)
  }

  inlineActionDisconnected(action: Action) {
    this.removeAction(action)
  }

  // Inline action observer & target set delegate

  canControlElement(element: Element): boolean {
    return this.delegate.xCanControlElement(this, element)
  }
}
