import { Action } from "./action"
import { Application } from "./application"
import { Configuration } from "./configuration"
import { ContextSet } from "./context_set"
import { Controller } from "./controller"
import { DataSet } from "./data_set"
import { Descriptor } from "./descriptor"
import { Dispatcher } from "./dispatcher"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { Logger, LoggerTag } from "./logger"
import { TargetSet } from "./target_set"

export interface ActionOptions {
  targetName: string
}

export class Context implements InlineActionObserverDelegate {
  contextSet: ContextSet
  element: Element

  controller: Controller
  targets: TargetSet
  data: DataSet
  private dispatcher: Dispatcher
  private inlineActionObserver: InlineActionObserver

  constructor(contextSet: ContextSet, element: Element) {
    this.contextSet = contextSet
    this.element = element

    this.targets = new TargetSet(this)
    this.data = new DataSet(this)
    this.dispatcher = new Dispatcher(this)
    this.inlineActionObserver = new InlineActionObserver(this, this)
    this.controller = new contextSet.controllerConstructor(this)

    this.debug("Initializing controller")
    this.controller.initialize()
  }

  connect() {
    this.debug("Connecting controller")
    this.dispatcher.start()
    this.inlineActionObserver.start()
    this.controller.connect()
  }

  disconnect() {
    this.debug("Disconnecting controller")
    this.controller.disconnect()
    this.inlineActionObserver.stop()
    this.dispatcher.stop()
  }

  canControlElement(element: Element): boolean {
    if (this.contextSet.size == 1) {
      return this.element == element || this.element.contains(element)
    } else {
      const selector = `[${this.controllerAttribute}~='${this.identifier}']`
      return element.closest(selector) == this.element
    }
  }

  get application(): Application {
    return this.contextSet.application
  }

  get identifier(): string {
    return this.contextSet.identifier
  }

  get configuration(): Configuration {
    return this.application.configuration
  }

  get controllerAttribute(): string {
    return this.configuration.controllerAttribute
  }

  get actionAttribute(): string {
    return this.configuration.actionAttribute
  }

  get targetAttribute(): string {
    return this.configuration.targetAttribute
  }

  get parentElement(): Element | null {
    return this.element.parentElement
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
      action = new Action(this, descriptor, eventTarget, matcher)
    }

    if (action) {
      this.debug(action.descriptor.loggerTag, "Adding action", action)
      this.dispatcher.addAction(action)
    }
  }

  removeAction(action: Action) {
    this.debug(action.descriptor.loggerTag, "Removing action", action)
    this.dispatcher.removeAction(action)
  }

  // Inline action observer delegate

  inlineActionConnected(action: Action) {
    this.addAction(action)
  }

  inlineActionDisconnected(action: Action) {
    this.removeAction(action)
  }

  // Logging

  debug(...args) {
    return this.logger.debug(this.loggerTag, ...args, this.controller, this.element)
  }

  error(...args) {
    return this.logger.error(this.loggerTag, ...args, this.controller, this.element)
  }

  get logger(): Logger {
    return this.application.logger
  }

  private get loggerTag(): LoggerTag {
    return new LoggerTag(this.identifier, "#fff", "#38f")
  }
}
