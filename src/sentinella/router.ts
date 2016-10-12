import { Context } from "./context"
import { Controller } from "./controller"
import { Multimap } from "./multimap"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { SelectorObserver, SelectorObserverDelegate } from "./selector_observer"
import { log } from "./logger"
import { scopesForDefinition } from "./definition"

export class Router implements SelectorObserverDelegate {
  element: Element
  parentRouter: Router | null
  selectorObserver: SelectorObserver

  scopes: Set<Scope>
  parentScopes: Map<Scope, Scope | null>
  scopesBySelector: Multimap<Selector, Scope>
  routersByElement: WeakMap<Element, Router>
  connectedControllers: Set<Controller>
  controllersByScope: WeakMap<Scope, Controller>

  constructor(element: Element, parentRouter: Router | null = null) {
    this.element = element
    this.parentRouter = parentRouter
    this.selectorObserver = new SelectorObserver(element, this)

    this.scopes = new Set()
    this.parentScopes = new Map()
    this.scopesBySelector = new Multimap<Selector, Scope>()
    this.routersByElement = new WeakMap()
    this.connectedControllers = new Set()
    this.controllersByScope = new WeakMap()
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
        router.connectControllerForScope(scope)
      }
    }
  }

  elementUnmatchedSelector(element: Element, selector: Selector) {
    const scopes = this.getScopesForSelector(selector)
    const router = this.getRouterForElement(element)
    if (scopes.length && router) {
      for (const scope of scopes) {
        router.disconnectControllerForScope(scope)
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

  private connectControllerForScope(scope: Scope) {
    const controller = this.fetchControllerForScope(scope)
    for (const childScope of scope.childScopes) {
      this.addScope(childScope, scope)
    }
    this.connectController(controller)
  }

  private disconnectControllerForScope(scope: Scope) {
    const controller = this.getControllerForScope(scope)
    if (controller) {
      for (const childScope of scope.childScopes) {
        this.deleteScope(childScope)
      }
      this.disconnectController(controller)
    }
  }

  private getControllerForScope(scope: Scope): Controller | null {
    return this.controllersByScope.get(scope) || null
  }

  private fetchControllerForScope(scope: Scope): Controller {
    let controller = this.controllersByScope.get(scope)
    if (!controller) {
      const parentController = this.getParentControllerForScope(scope)
      const context = new Context(parentController, this, scope)
      controller = new scope.controllerConstructor(context)
      this.controllersByScope.set(scope, controller)
    }

    return controller
  }

  private connectController(controller: Controller) {
    log("connectController", controller)
    if (this.connectedControllers.has(controller)) {
      throw new Error("Controller is already connected")
    } else {
      this.connectedControllers.add(controller)
      controller.connect()
    }
  }

  private disconnectController(controller: Controller) {
    log("disconnectController", controller)
    if (this.connectedControllers.has(controller)) {
      this.connectedControllers.delete(controller)
      controller.disconnect()
    } else {
      throw new Error("Controller is not connected")
    }
  }

  private getParentControllerForScope(scope: Scope): Controller | null {
    let parentController: Controller | null = null
    const parentRouter = this.parentRouter
    if (parentRouter) {
      const parentScope = parentRouter.getParentForScope(scope)
      if (parentScope) {
        parentController = parentRouter.getControllerForScope(parentScope)
      }
    }

    return parentController
  }

  private getParentForScope(scope: Scope): Scope | null {
    return this.parentScopes.get(scope) || null
  }
}
