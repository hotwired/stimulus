import { scopesForDefinition } from "./definition"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { SelectorObserver, SelectorObserverDelegate } from "./selector_observer"
import { Multimap } from "./multimap"
import { Instance } from "./instance"

export class Region implements SelectorObserverDelegate {
  parentRegion: Region | null
  element: Element
  scopes: Set<Scope>
  scopesBySelector: Multimap<Selector, Scope>
  selectorObserver: SelectorObserver
  instances: WeakMap<Element, Instance>

  constructor(parentRegion: Region | null, element: Element) {
    this.parentRegion = parentRegion
    this.element = element
    this.scopes = new Set()
    this.scopesBySelector = new Multimap<Selector, Scope>()
    this.selectorObserver = new SelectorObserver(element, this)
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

  addScope(scope: Scope) {
    const selector = scope.selector
    this.scopes.add(scope)
    this.scopesBySelector.add(selector, scope)
    if (this.scopesBySelector.getValueCountForKey(selector) == 1) {
      this.selectorObserver.observeSelector(selector)
    }
  }

  deleteScope(scope: Scope) {
    const selector = scope.selector
    this.scopes.delete(scope)
    this.scopesBySelector.delete(selector, scope)
    if (this.scopesBySelector.getValueCountForKey(selector) == 0) {
      this.selectorObserver.stopObservingSelector(selector)
    }
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

  // Private

  private getScopesForSelector(selector: Selector): Scope[] {
    return this.scopesBySelector.getValuesForKey(selector)
  }

  private fetchInstanceForElement(element: Element) {
    let instance = this.instances.get(element)
    if (!instance) {
      instance = new Instance(element)
      this.instances.set(element, instance)
    }

    return instance
  }
}
