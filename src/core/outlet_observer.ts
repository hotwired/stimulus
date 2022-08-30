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
  }

  stop() {
    if (this.selectorObserverMap.size > 0) {
      this.disconnectAllOutlets()
      this.selectorObserverMap.forEach(observer => observer.stop())
      this.selectorObserverMap.clear()
    }
  }

  // Selector observer delegate

  selectorMatched(element: Element, _selector: string, { outletName }: SelectorObserverDetails) {
    const outlet = this.context.application.getControllerForElementAndIdentifier(element, outletName)

    if (outlet) {
      this.connectOutlet(outlet, element, outletName)
    }
  }

  selectorUnmatched(element: Element, _selector: string, { outletName }: SelectorObserverDetails) {
    const outlet = this.outletsByName.getValuesForKey(outletName).find(outlet => outlet.element === element)

    if (outlet) {
      this.disconnectOutlet(outlet, element, outletName)
    }
  }

  selectorMatchElement(element: Element, { outletName }: SelectorObserverDetails) {
    return element.matches(`[${this.context.application.schema.controllerAttribute}~=${outletName}]`)
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

  private get outletDefinitions() {
    return readInheritableStaticArrayValues(this.context.controller.constructor as any, "outlets")
  }

  private get scope() {
    return this.context.scope
  }
}
