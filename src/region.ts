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

  define(definition) {
    for (const scope of scopesForDefinition(definition)) {
      this.addScope(scope)
    }
  }

  addScope(scope: Scope) {
    this.scopes.add(scope)
    this.scopesBySelector.add(scope.selector, scope)
    this.selectorObserver.observeSelector(scope.selector)
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
