import { Action } from "./action"
import { Application } from "./application"
import { Configuration } from "./configuration"
import { Controller, ControllerConstructor } from "./controller"
import { Descriptor } from "./descriptor"
import { Dispatcher } from "./dispatcher"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { TargetSet, TargetSetDelegate } from "./target_set"
import { DataSet } from "./data_set"
import { Logger } from "./logger"

export interface ContextDelegate {
  contextCanControlElement(context: Context, element: Element): boolean
}

export interface ActionOptions {
  targetName: string
}

const logger = Logger.create("controller")

export class Context implements InlineActionObserverDelegate, TargetSetDelegate {
  application: Application
  identifier: string
  element: Element
  delegate: ContextDelegate

  controller: Controller
  targets: TargetSet
  data: DataSet
  private dispatcher: Dispatcher
  private inlineActionObserver: InlineActionObserver

  constructor(application: Application, identifier: string, element: Element, controllerConstructor: ControllerConstructor, delegate: ContextDelegate) {
    this.application = application
    this.identifier = identifier
    this.element = element
    this.delegate = delegate

    this.targets = new TargetSet(this.targetAttribute, identifier, element, this)
    this.data = new DataSet(identifier, element)
    this.dispatcher = new Dispatcher(this)
    this.inlineActionObserver = new InlineActionObserver(this.actionAttribute, identifier, element, this)
    this.controller = new controllerConstructor(this)

    this.logCallback("initialize")
    this.controller.initialize()
  }

  connect() {
    this.dispatcher.start()
    this.inlineActionObserver.start()
    this.logCallback("connect")
    this.controller.connect()
  }

  disconnect() {
    this.logCallback("disconnect")
    this.controller.disconnect()
    this.inlineActionObserver.stop()
    this.dispatcher.stop()
  }

  private logCallback(methodName) {
    logger.log(`${this.identifier}#${methodName}`, { element: this.element })
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  private get configuration(): Configuration {
    return this.application.configuration
  }

  private get actionAttribute(): string {
    return this.configuration.actionAttribute
  }

  private get targetAttribute(): string {
    return this.configuration.targetAttribute
  }

  // Actions

  addAction(action: Action)
  addAction(descriptorString: string, options?: ActionOptions)
  addAction(descriptorString: string, eventTarget: EventTarget)
  addAction(actionOrDescriptorString, optionsOrEventTarget?) {
    let action

    if (actionOrDescriptorString instanceof Action) {
      action = actionOrDescriptorString

    } else if (typeof actionOrDescriptorString == "string") {
      const descriptorString = actionOrDescriptorString
      let eventTarget, matcher

      if (optionsOrEventTarget instanceof EventTarget) {
        eventTarget = optionsOrEventTarget
      } else {
        eventTarget = this.element
        if (optionsOrEventTarget) {
          const {targetName} = optionsOrEventTarget
          matcher = (element) => this.targets.matchesElementWithTargetName(element, targetName)
        }
      }

      const descriptor = Descriptor.forElementWithInlineDescriptorString(eventTarget, descriptorString)
      action = new Action(this.controller, descriptor, eventTarget, matcher)
    }

    if (action) {
      this.dispatcher.addAction(action)
    }
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
    return this.delegate.contextCanControlElement(this, element)
  }
}
