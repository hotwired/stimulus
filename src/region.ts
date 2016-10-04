import { scopesForDefinition } from "./definition"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { SelectorObserver, SelectorObserverDelegate } from "./selector_observer"
import { Multimap } from "./multimap"
import { Registry } from "./registry"
import { Instance } from "./instance"

export class Region implements SelectorObserverDelegate {
  parentRegion: Region | null
  element: Element
  scopes: Set<Scope>
  scopesBySelector: Multimap<Selector, Scope>
  selectorObserver: SelectorObserver
  registry: Registry

  constructor(parentRegion: Region | null, element: Element) {
    this.parentRegion = parentRegion
    this.element = element
    this.scopes = new Set()
    this.scopesBySelector = new Multimap<Selector, Scope>()
    this.selectorObserver = new SelectorObserver(element, this)
    this.registry = new Registry()
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

  getScopesForSelector(selector: Selector): Scope[] {
    return this.scopesBySelector.getValuesForKey(selector)
  }

  // Selector observer delegate

  elementMatchedSelector(element: Element, selector: Selector) {
    const instance = this.registry.fetchInstanceForElementAndSelector(element, selector)
    for (const scope of this.getScopesForSelector(selector)) {
      instance.connectControllerForScope(scope)
    }
  }

  elementUnmatchedSelector(element: Element, selector: Selector) {
    const instance = this.registry.getInstanceForElementAndSelector(element, selector)
    if (instance) {
      for (const scope of this.getScopesForSelector(selector)) {
        instance.disconnectControllerForScope(scope)
      }
    }
  }
}
