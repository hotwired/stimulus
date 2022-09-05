import { Multimap } from "../multimap"
import { SelectorObserver, SelectorObserverDelegate } from "../mutation-observers"
import { Context } from "./context"
import { Controller } from "./controller"

import { readInheritableStaticArrayValues } from "./inheritable_statics"

type SelectorObserverDetails = { outletName: string }

export interface OutletObserverDelegate {
  outletConnected(outlet: Controller, element: Element, outletName: string): void
  outletDisconnected(outlet: Controller, element: Element, outletName: string): void
}

export class OutletObserver implements SelectorObserverDelegate {
  readonly context: Context
  readonly delegate: OutletObserverDelegate
  readonly outletsByName: Multimap<string, Controller>
  readonly outletElementsByName: Multimap<string, Element>
  private selectorObserverMap: Map<string, SelectorObserver>

  constructor(context: Context, delegate: OutletObserverDelegate) {
    this.context = context
    this.delegate = delegate
    this.outletsByName = new Multimap()
    this.outletElementsByName = new Multimap()
    this.selectorObserverMap = new Map()
  }

  start() {
    if (this.selectorObserverMap.size === 0) {
      this.outletDefinitions.forEach(outletName => {
        const selector = this.selector(outletName)
        const details: SelectorObserverDetails = { outletName }

        if (selector) {
          this.selectorObserverMap.set(outletName, new SelectorObserver(document.body, selector, this, details))
        }
      })

      this.selectorObserverMap.forEach(observer => observer.start())
    }

    this.dependentContexts.forEach(context => context.refresh())
  }

  stop() {
    if (this.selectorObserverMap.size > 0) {
      this.disconnectAllOutlets()
      this.selectorObserverMap.forEach(observer => observer.stop())
      this.selectorObserverMap.clear()
    }
  }

  refresh() {
    this.selectorObserverMap.forEach(observer => observer.refresh())
  }

  // Selector observer delegate

  selectorMatched(element: Element, _selector: string, { outletName }: SelectorObserverDetails) {
    const outlet = this.getOutlet(element, outletName)

    if (outlet) {
      this.connectOutlet(outlet, element, outletName)
    }
  }

  selectorUnmatched(element: Element, _selector: string, { outletName }: SelectorObserverDetails) {
    const outlet = this.getOutletFromMap(element, outletName)

    if (outlet) {
      this.disconnectOutlet(outlet, element, outletName)
    }
  }

  selectorMatchElement(element: Element, { outletName }: SelectorObserverDetails) {
    return this.hasOutlet(element, outletName) && element.matches(`[${this.context.application.schema.controllerAttribute}~=${outletName}]`)
  }

  // Outlet management

  connectOutlet(outlet: Controller, element: Element, outletName: string) {
    if (!this.outletElementsByName.has(outletName, element)) {
      this.outletsByName.add(outletName, outlet)
      this.outletElementsByName.add(outletName, element)
      this.selectorObserverMap.get(outletName)?.pause(() => this.delegate.outletConnected(outlet, element, outletName))
    }
  }

  disconnectOutlet(outlet: Controller, element: Element, outletName: string) {
    if (this.outletElementsByName.has(outletName, element)) {
      this.outletsByName.delete(outletName, outlet)
      this.outletElementsByName.delete(outletName, element)
      this.selectorObserverMap.get(outletName)?.pause(() => this.delegate.outletDisconnected(outlet, element, outletName))
    }
  }

  disconnectAllOutlets() {
    for (const outletName of this.outletElementsByName.keys) {
      for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
        for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
          this.disconnectOutlet(outlet, element, outletName)
        }
      }
    }
  }

  // Private

  private selector(outletName: string) {
    return this.scope.outlets.getSelectorForOutletName(outletName)
  }

  private get outletDependencies() {
    const dependencies = new Multimap<string, string>()

    this.router.modules.forEach(module => {
      const constructor = module.definition.controllerConstructor
      const outlets = readInheritableStaticArrayValues(constructor, "outlets")

      outlets.forEach(outlet => dependencies.add(outlet, module.identifier))
    })

    return dependencies
  }

  private get outletDefinitions() {
    return this.outletDependencies.getKeysForValue(this.identifier)
  }

  private get dependentControllerIdentifiers() {
    return this.outletDependencies.getValuesForKey(this.identifier)
  }

  private get dependentContexts() {
    const identifiers = this.dependentControllerIdentifiers
    return this.router.contexts.filter(context => identifiers.includes(context.identifier))
  }

  private hasOutlet(element: Element, outletName: string) {
    return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName)
  }

  private getOutlet(element: Element, outletName: string) {
    return this.application.getControllerForElementAndIdentifier(element, outletName)
  }

  private getOutletFromMap(element: Element, outletName: string) {
    return this.outletsByName.getValuesForKey(outletName).find(outlet => outlet.element === element)
  }

  private get scope() {
    return this.context.scope
  }

  private get identifier() {
    return this.context.identifier
  }

  private get application() {
    return this.context.application
  }

  private get router() {
    return this.application.router
  }
}
