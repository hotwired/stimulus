import { Action } from "./action"
import { ActionDescriptor } from "./action_descriptor"
import { ActionSet } from "./action_set"
import { Application } from "./application"
import { Controller } from "./controller"
import { InlineActionObserver, InlineActionObserverDelegate } from "./inline_action_observer"
import { Module } from "./module"
import { Schema } from "./schema"
import { Scope } from "./scope"

export class Context implements InlineActionObserverDelegate {
  readonly module: Module
  readonly scope: Scope
  readonly controller: Controller
  private actions: ActionSet
  private inlineActionObserver: InlineActionObserver

  constructor(module: Module, element: Element) {
    this.module = module
    this.scope = new Scope(this.schema, this.identifier, element)
    this.actions = new ActionSet(this)
    this.inlineActionObserver = new InlineActionObserver(this, this)

    try {
      this.controller = new module.controllerConstructor(this)
      this.controller.initialize()
    } catch (error) {
      this.reportError(error, `initializing controller "${this.identifier}"`)
    }
  }

  connect() {
    this.actions.start()
    this.inlineActionObserver.start()

    try {
      this.controller.connect()
    } catch (error) {
      this.reportError(error, `connecting controller "${this.identifier}"`)
    }
  }

  disconnect() {
    try {
      this.controller.disconnect()
    } catch (error) {
      this.reportError(error, `disconnecting controller "${this.identifier}"`)
    }

    this.inlineActionObserver.stop()
    this.actions.stop()
  }

  get application(): Application {
    return this.module.application
  }

  get identifier(): string {
    return this.module.identifier
  }

  get schema(): Schema {
    return this.application.schema
  }

  get element(): Element {
    return this.scope.element
  }

  get parentElement(): Element | null {
    return this.element.parentElement
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
      this.actions.add(action)
    }
  }

  removeAction(action: Action) {
    this.actions.delete(action)
  }

  // Inline action observer delegate

  /** @private */
  inlineActionConnected(action: Action) {
    this.addAction(action)
  }

  /** @private */
  inlineActionDisconnected(action: Action) {
    this.removeAction(action)
  }

  // Logging

  reportError(error, message, ...args) {
    const argsFormat = args.map(arg => "%o").join("\n")
    const format = `Error %s\n\n%o\n\n${argsFormat}\n%o\n%o`
    return console.error(format, message, error, ...args, this.controller, this.element)
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
