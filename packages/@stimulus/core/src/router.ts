import { Application } from "./application"
import { Context } from "./context"
import { Definition } from "./definition"
import { Module } from "./module"
import { Multimap } from "@stimulus/multimap"
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
    this.scopesByIdentifier = new Multimap
    this.modulesByIdentifier = new Map
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
      return module.contexts.find(context => context.element == element)
    }
  }

  // Error handler delegate

  /** @hidden */
  handleError(error: Error, message: string, detail: any) {
    this.application.handleError(error, message, detail)
  }

  // Scope observer delegate

  /** @hidden */
  createScopeForElementAndIdentifier(element: Element, identifier: string) {
    return new Scope(this.schema, element, identifier, this.logger)
  }

  /** @hidden */
  scopeConnected(scope: Scope) {
    this.scopesByIdentifier.add(scope.identifier, scope)
    const module = this.modulesByIdentifier.get(scope.identifier)
    if (module) {
      module.connectContextForScope(scope)
    }
  }

  /** @hidden */
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
    scopes.forEach(scope => module.connectContextForScope(scope))
  }

  private disconnectModule(module: Module) {
    this.modulesByIdentifier.delete(module.identifier)
    const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier)
    scopes.forEach(scope => module.disconnectContextForScope(scope))
  }
}
