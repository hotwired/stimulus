import { Context } from "./context"
import { Trait } from "./trait"
import { Multimap } from "./multimap"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { SelectorObserver, SelectorObserverDelegate } from "./selector_observer"
import { scopesForDefinition } from "./definition"

export class Router implements SelectorObserverDelegate {
  element: Element
  parentRouter: Router | null
  selectorObserver: SelectorObserver

  scopes: Set<Scope>
  parentScopes: Map<Scope, Scope | null>
  scopesBySelector: Multimap<Selector, Scope>
  routersByElement: WeakMap<Element, Router>
  contextsByScope: WeakMap<Scope, Context>

  constructor(element: Element, parentRouter: Router | null = null) {
    this.element = element
    this.parentRouter = parentRouter
    this.selectorObserver = new SelectorObserver(element, this)

    this.scopes = new Set()
    this.parentScopes = new Map()
    this.scopesBySelector = new Multimap<Selector, Scope>()
    this.routersByElement = new WeakMap()
    this.contextsByScope = new WeakMap()
  }

  start() {
    this.selectorObserver.start()
  }

  stop() {
    this.selectorObserver.stop()
  }

  define(definition) {
    for (const scope of scopesForDefinition(definition)) {
      this.addScope(scope)
    }
  }

  addScope(scope: Scope, parentScope: Scope | null = null) {
    if (this.scopes.has(scope)) {
      throw new Error("Scope already exists in router")
    } else {
      const selector = scope.selector
      this.scopes.add(scope)
      this.parentScopes.set(scope, parentScope)
      this.scopesBySelector.add(selector, scope)

      if (this.scopesBySelector.getValueCountForKey(selector) == 1) {
        this.selectorObserver.observeSelector(selector)
      }
    }
  }

  deleteScope(scope: Scope) {
    if (this.scopes.has(scope)) {
      const selector = scope.selector
      this.scopes.delete(scope)
      this.parentScopes.delete(scope)
      this.scopesBySelector.delete(selector, scope)

      if (this.scopesBySelector.getValueCountForKey(selector) == 0) {
        this.selectorObserver.stopObservingSelector(selector)
      }
    } else {
      throw new Error("Scope doesn't exist in router")
    }
  }

  elementMatchedSelector(element: Element, selector: Selector) {
    const scopes = this.getScopesForSelector(selector)
    if (scopes.length) {
      const router = this.fetchRouterForElement(element)
      for (const scope of scopes) {
        router.connectScope(scope)
      }
    }
  }

  elementUnmatchedSelector(element: Element, selector: Selector) {
    const scopes = this.getScopesForSelector(selector)
    const router = this.getRouterForElement(element)
    if (scopes.length && router) {
      for (const scope of scopes) {
        router.disconnectScope(scope)
      }
    }
  }

  private getScopesForSelector(selector: Selector): Scope[] {
    return this.scopesBySelector.getValuesForKey(selector)
  }

  private getRouterForElement(element: Element): Router | undefined {
    return this.routersByElement.get(element)
  }

  private fetchRouterForElement(element: Element): Router {
    let router = this.routersByElement.get(element)
    if (!router) {
      router = new Router(element, this)
      this.routersByElement.set(element, router)
      router.start()
    }

    return router
  }

  private connectScope(scope: Scope) {
    const context = this.fetchContextForScope(scope)
    if (!context.connected) {
      for (const childScope of scope.childScopes) {
        this.addScope(childScope, scope)
      }
      context.connect()
    }
  }

  private disconnectScope(scope: Scope) {
    const context = this.getContextForScope(scope)
    if (context && context.connected) {
      for (const childScope of scope.childScopes) {
        this.deleteScope(childScope)
      }
      context.disconnect()
    }
  }

  private getContextForScope(scope: Scope): Context | null {
    return this.contextsByScope.get(scope) || null
  }

  private fetchContextForScope(scope: Scope): Context {
    let context = this.getContextForScope(scope)
    if (!context) {
      const parentTrait = this.getParentTraitForScope(scope)
      context = new Context(parentTrait, this, scope)
      this.contextsByScope.set(scope, context)
    }

    return context
  }

  private getParentTraitForScope(scope: Scope): Trait | null {
    let parentTrait: Trait | null = null
    const parentRouter = this.parentRouter
    if (parentRouter) {
      const parentScope = parentRouter.getParentForScope(scope)
      if (parentScope) {
        parentTrait = parentRouter.getTraitForScope(parentScope)
      }
    }

    return parentTrait
  }

  private getParentForScope(scope: Scope): Scope | null {
    return this.parentScopes.get(scope) || null
  }

  private getTraitForScope(scope: Scope): Trait | null {
    const context = this.getContextForScope(scope)
    return context ? context.trait : null
  }
}
