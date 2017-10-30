import { Action } from "./action"
import { ActionDescriptor } from "./action_descriptor"
import { Application } from "./application"
import { Configuration } from "./configuration"
import { ContextSet } from "./context_set"
import { Controller } from "./controller"
import { DataMap } from "./data_map"
import { Dispatcher } from "./dispatcher"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { Logger, LoggerTag } from "./logger"
import { TargetSet } from "./target_set"

export class Context implements InlineActionObserverDelegate {
  contextSet: ContextSet
  element: Element

  controller: Controller
  targets: TargetSet
  data: DataMap
  private dispatcher: Dispatcher
  private inlineActionObserver: InlineActionObserver

  constructor(contextSet: ContextSet, element: Element) {
    this.contextSet = contextSet
    this.element = element

    this.targets = new TargetSet(this)
    this.data = new DataMap(this)
    this.dispatcher = new Dispatcher(this)
    this.inlineActionObserver = new InlineActionObserver(this, this)
    this.controller = new contextSet.controllerConstructor(this)

    try {
      this.debug("Initializing controller")
      this.controller.initialize()
    } catch (error) {
      this.error(error, "while initializing controller")
    }
  }

  connect() {
    this.dispatcher.start()
    this.inlineActionObserver.start()

    try {
      this.debug("Connecting controller")
      this.controller.connect()
    } catch (error) {
      this.error(error, "while connecting controller")
    }
  }

  disconnect() {
    try {
      this.debug("Disconnecting controller")
      this.controller.disconnect()
    } catch (error) {
      this.error(error, "while disconnecting controller")
    }

    this.inlineActionObserver.stop()
    this.dispatcher.stop()
  }

  canControlElement(element: Element): boolean {
    return element.closest(this.selector) == this.element
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

  get selector(): string {
    return `[${this.controllerAttribute}~='${this.identifier}']`
  }

  // Actions

  addAction(action: Action)
  addAction(descriptorString: string, eventTarget: EventTarget)
  addAction(actionOrDescriptorString, eventTarget?) {
    let action

    if (actionOrDescriptorString instanceof Action) {
      action = actionOrDescriptorString

    } else if (typeof actionOrDescriptorString == "string") {
      const descriptorString = actionOrDescriptorString
      if (!isEventTarget(eventTarget)) {
        eventTarget = this.element
      }
      const descriptor = ActionDescriptor.forElementWithInlineDescriptorString(eventTarget, descriptorString)
      action = new Action(this, descriptor, eventTarget)
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

function isEventTarget(object: any): boolean {
  if (!object) {
    return false
  } else if (typeof EventTarget != "undefined") {
    return object instanceof EventTarget
  } else {
    return typeof object.addEventListener == "function"
  }
}
