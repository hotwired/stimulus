import { scopesForDefinition } from "./definition"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { SelectorObserver, SelectorObserverDelegate } from "./selector_observer"
import { Multimap } from "./multimap"
import { Instance } from "./instance"

export class Region implements SelectorObserverDelegate {
  parentRegion: Region | null
  instance: Instance
  scopes: Set<Scope>
  parentScopes: Map<Scope, Scope | null>
  scopesBySelector: Multimap<Selector, Scope>
  selectorObserver: SelectorObserver
  instances: WeakMap<Element, Instance>

  constructor(parentRegion: Region | null, instance: Instance) {
    this.parentRegion = parentRegion
    this.instance = instance
    this.scopes = new Set()
    this.parentScopes = new Map()
    this.scopesBySelector = new Multimap<Selector, Scope>()
    this.selectorObserver = new SelectorObserver(this.element, this)
    this.instances = new WeakMap()
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

  get element(): Element {
    return this.instance.element
  }

  // Scopes

  addScope(scope: Scope, parentScope: Scope | null = null) {
    if (!this.scopes.has(scope)) { 
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
    }
  }

  getParentForScope(scope: Scope) : Scope | null {
    return this.parentScopes.get(scope) || null
  }

  private getScopesForSelector(selector: Selector): Scope[] {
    return this.scopesBySelector.getValuesForKey(selector)
  }

  // Selector observer delegate

  elementMatchedSelector(element: Element, selector: Selector) {
    for (const scope of this.getScopesForSelector(selector)) {
      const instance = this.fetchInstanceForElement(element)
      instance.connectScope(scope)
    }
  }

  elementUnmatchedSelector(element: Element, selector: Selector) {
    for (const scope of this.getScopesForSelector(selector)) {
      const instance = this.fetchInstanceForElement(element)
      instance.disconnectScope(scope)
    }
  }

  private fetchInstanceForElement(element: Element) {
    let instance = this.instances.get(element)
    if (!instance) {
      instance = new Instance(this, element)
      this.instances.set(element, instance)
    }

    return instance
  }
}
