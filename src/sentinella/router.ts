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
  connectedTraits: Set<Trait>
  traitsByScope: WeakMap<Scope, Trait>

  constructor(element: Element, parentRouter: Router | null = null) {
    this.element = element
    this.parentRouter = parentRouter
    this.selectorObserver = new SelectorObserver(element, this)

    this.scopes = new Set()
    this.parentScopes = new Map()
    this.scopesBySelector = new Multimap<Selector, Scope>()
    this.routersByElement = new WeakMap()
    this.connectedTraits = new Set()
    this.traitsByScope = new WeakMap()
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
        router.connectTraitForScope(scope)
      }
    }
  }

  elementUnmatchedSelector(element: Element, selector: Selector) {
    const scopes = this.getScopesForSelector(selector)
    const router = this.getRouterForElement(element)
    if (scopes.length && router) {
      for (const scope of scopes) {
        router.disconnectTraitForScope(scope)
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

  private connectTraitForScope(scope: Scope) {
    const trait = this.fetchTraitForScope(scope)
    for (const childScope of scope.childScopes) {
      this.addScope(childScope, scope)
    }
    this.connectTrait(trait)
  }

  private disconnectTraitForScope(scope: Scope) {
    const trait = this.getTraitForScope(scope)
    if (trait) {
      for (const childScope of scope.childScopes) {
        this.deleteScope(childScope)
      }
      this.disconnectTrait(trait)
    }
  }

  private getTraitForScope(scope: Scope): Trait | null {
    return this.traitsByScope.get(scope) || null
  }

  private fetchTraitForScope(scope: Scope): Trait {
    let trait = this.traitsByScope.get(scope)
    if (!trait) {
      const parentTrait = this.getParentTraitForScope(scope)
      const context = new Context(parentTrait, this, scope)
      trait = new scope.traitConstructor(context)
      this.traitsByScope.set(scope, trait)
    }

    return trait
  }

  private connectTrait(trait: Trait) {
    if (this.connectedTraits.has(trait)) {
      throw new Error("Trait is already connected")
    } else {
      this.connectedTraits.add(trait)
      trait.connect()
    }
  }

  private disconnectTrait(trait: Trait) {
    if (this.connectedTraits.has(trait)) {
      this.connectedTraits.delete(trait)
      trait.disconnect()
    } else {
      throw new Error("Trait is not connected")
    }
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
}
