import { Application, AsyncConstructor } from "./application"
import { Context } from "./context"
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
  private lazyModulesByIdentifier: Map<string, AsyncConstructor>

  constructor(application: Application) {
    this.application = application
    this.scopeObserver = new ScopeObserver(this.element, this.schema, this)
    this.scopesByIdentifier = new Multimap()
    this.lazyModulesByIdentifier = new Map()
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

  // Error handler delegate

  handleError(error: Error, message: string, detail: any) {
    this.application.handleError(error, message, detail)
  }

  // Scope observer delegate

  createScopeForElementAndIdentifier(element: Element, identifier: string) {
    return new Scope(this.schema, element, identifier, this.logger)
  }

  scopeConnected(scope: Scope) {
    const { identifier } = scope
    this.scopesByIdentifier.add(identifier, scope)
    const module = this.modulesByIdentifier.get(scope.identifier)
    if (module) {
      module.connectContextForScope(scope)
    } else if (this.lazyModulesByIdentifier.has(identifier)) {
      this.loadLazyModule(identifier)
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

  registerLazyModule(identifier: string, controllerConstructor: AsyncConstructor) {
    if (!this.modulesByIdentifier.has(identifier) && !this.lazyModulesByIdentifier.has(identifier)) {
      this.lazyModulesByIdentifier.set(identifier, controllerConstructor)
    } else {
      this.application.logger.warn(`Stimulus has already a controller with "${identifier}" registered.`)
    }
  }

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

  private loadLazyModule(identifier: string) {
    const callback = this.lazyModulesByIdentifier.get(identifier)
    if (callback && typeof callback === "function") {
      callback().then((controllerConstructor) => {
        if (!this.modulesByIdentifier.has(identifier)) {
          this.loadDefinition({ identifier, controllerConstructor })
          this.lazyModulesByIdentifier.delete(identifier)
        }
      })
    } else {
      this.application.logger.warn(
        `Stimulus expected the callback registered for "${identifier}" to resolve to a controllerConstructor but didn't`,
        `Failed to lazy load ${identifier}`,
        { identifier }
      )
    }
  }
}
