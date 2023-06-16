import { Application } from "./application"
import { Context } from "./context"
import { Definition } from "./definition"
import { Module } from "./module"
import { Multimap } from "../multimap"
import { Scope } from "./scope"
import { ScopeObserver, ScopeObserverDelegate } from "./scope_observer"
import { Token } from "../mutation-observers"
import { Guide } from "./guide"
import { Action } from "./action"

export class Router implements ScopeObserverDelegate {
  readonly application: Application
  private scopeObserver: ScopeObserver
  private scopesByIdentifier: Multimap<string, Scope>
  private modulesByIdentifier: Map<string, Module>
  private guide: Guide

  constructor(application: Application) {
    this.application = application
    this.scopeObserver = new ScopeObserver(this.element, this.schema, this)
    this.scopesByIdentifier = new Multimap()
    this.modulesByIdentifier = new Map()
    this.guide = new Guide(this.warningHandler)
  }

  get element() {
    return this.application.element
  }

  get schema() {
    return this.application.schema
  }

  get warningHandler() {
    return this.application
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

  // Error handler delegate

  handleError(error: Error, message: string, detail: any) {
    this.application.handleError(error, message, detail)
  }

  handleWarningsWithDuplicates(element: Element, token: Token, error?: Error) {
    if (!error) {
      const parsed = Action.forToken(token, this.schema)

      if (!this.modules.map((c) => c.identifier).includes(parsed.identifier)) {
        this.guide.warn(
          element,
          `identifier:${parsed.identifier}`,
          `Warning connecting "${token.content}" to undefined controller "${parsed.identifier}"`,
          `Warning connecting "${token.content}" to undefined controller "${parsed.identifier}"`
        )
      }
    }
  }

  // Scope observer delegate

  createScopeForElementAndIdentifier(element: Element, identifier: string) {
    return new Scope(this.schema, element, identifier, this.application)
  }

  scopeConnected(scope: Scope) {
    const { element, identifier } = scope
    this.scopesByIdentifier.add(identifier, scope)
    const module = this.modulesByIdentifier.get(identifier)

    if (module) {
      module.connectContextForScope(scope)
    } else {
      const registeredIdentifiers = Array.from(this.modulesByIdentifier.keys()).sort()

      this.application.handleWarning(
        `Stimulus is unable to connect the controller with identifier "${identifier}". The specified controller is not registered within the application. Please ensure that the controller with the identifier "${identifier}" is properly registered. For reference, the warning details include a list of all currently registered controller identifiers.`,
        `Warning: Element references an unregistered controller identifier "${identifier}".`,
        { identifier, element, registeredIdentifiers }
      )
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
