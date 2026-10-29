import { Application } from "./application"
import { Context } from "./context"
import { Controller, ControllerConstructor } from "./controller"
import { Definition } from "./definition"
import { Module } from "./module"
import { Multimap } from "../multimap"
import { Scope } from "./scope"
import { ScopeObserver, ScopeObserverDelegate } from "./scope_observer"

export class Router implements ScopeObserverDelegate {
  readonly application: Application
  private scopeObserver: ScopeObserver
  private scopesByIdentifier: Multimap<string, Scope>
  private modulesByIdentifier: Map<string, Module>

  constructor(application: Application) {
    this.application = application
    this.scopeObserver = new ScopeObserver(this.element, this.schema, this)
    this.scopesByIdentifier = new Multimap()
    this.modulesByIdentifier = new Map()
  }

  get element() {
    return this.application.element
  }

  get schema() {
    return this.application.schema
  }

  get logger() {
    return this.application.logger
  }

  get controllerAttribute(): string {
    return this.schema.controllerAttribute
  }

  get modules() {
    return Array.from(this.modulesByIdentifier.values())
  }

  get contexts() {
    return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), [] as Context[])
  }

  start() {
    this.scopeObserver.start()
  }

  stop() {
    this.scopeObserver.stop()
  }

  loadDefinition(definition: Definition) {
    this.unloadIdentifier(definition.identifier)
    this.warnAboutOverriddenControllerProperties(definition)
    const module = new Module(this.application, definition)
    this.connectModule(module)
    const afterLoad = (definition.controllerConstructor as any).afterLoad
    if (afterLoad) {
      afterLoad.call(definition.controllerConstructor, definition.identifier, this.application)
    }
  }

  unloadIdentifier(identifier: string) {
    const module = this.modulesByIdentifier.get(identifier)
    if (module) {
      this.disconnectModule(module)
    }
  }

  getContextForElementAndIdentifier(element: Element, identifier: string) {
    const module = this.modulesByIdentifier.get(identifier)
    if (module) {
      return module.contexts.find((context) => context.element == element)
    }
  }

  proposeToConnectScopeForElementAndIdentifier(element: Element, identifier: string) {
    const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier)

    if (scope) {
      this.scopeObserver.elementMatchedValue(scope.element, scope)
    } else {
      console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element)
    }
  }

  private warnAboutOverriddenControllerProperties({ identifier, controllerConstructor }: Definition) {
    for (const name of getOverriddenControllerProperties(controllerConstructor)) {
      this.logger.warn(
        `The "${identifier}" controller overrides "${name}", a property Stimulus defines on Controller and reads itself. Rename it to keep the controller working.`,
        controllerConstructor
      )
    }
  }

  // Error handler delegate

  handleError(error: Error, message: string, detail: any) {
    this.application.handleError(error, message, detail)
  }

  // Scope observer delegate

  createScopeForElementAndIdentifier(element: Element, identifier: string) {
    return new Scope(this.schema, element, identifier, this.logger)
  }

  scopeConnected(scope: Scope) {
    this.scopesByIdentifier.add(scope.identifier, scope)
    const module = this.modulesByIdentifier.get(scope.identifier)
    if (module) {
      module.connectContextForScope(scope)
    }
  }

  scopeDisconnected(scope: Scope) {
    this.scopesByIdentifier.delete(scope.identifier, scope)
    const module = this.modulesByIdentifier.get(scope.identifier)
    if (module) {
      module.disconnectContextForScope(scope)
    }
  }

  // Modules

  private connectModule(module: Module) {
    this.modulesByIdentifier.set(module.identifier, module)
    const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier)
    scopes.forEach((scope) => module.connectContextForScope(scope))
  }

  private disconnectModule(module: Module) {
    this.modulesByIdentifier.delete(module.identifier)
    const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier)
    scopes.forEach((scope) => module.disconnectContextForScope(scope))
  }
}

function getOverriddenControllerProperties(constructor: ControllerConstructor) {
  const names = getControllerPropertyNames()
  const overridden: string[] = []
  let prototype = constructor.prototype
  while (prototype && prototype != Controller.prototype && prototype != Object.prototype) {
    for (const name of names) {
      if (Object.prototype.hasOwnProperty.call(prototype, name) && !overridden.includes(name)) {
        overridden.push(name)
      }
    }
    prototype = Object.getPrototypeOf(prototype)
  }
  return overridden
}

// The accessors Controller defines (application, scope, element, identifier, targets, outlets, classes, data).
// Its methods are meant to be overridden.
function getControllerPropertyNames() {
  return Object.getOwnPropertyNames(Controller.prototype).filter((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(Controller.prototype, name)
    return descriptor && typeof descriptor.get == "function"
  })
}
