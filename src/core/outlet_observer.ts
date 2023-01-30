import { Multimap } from "../multimap"
import { AttributeObserver, AttributeObserverDelegate } from "../mutation-observers"
import { SelectorObserver, SelectorObserverDelegate } from "../mutation-observers"
import { Context } from "./context"
import { Controller } from "./controller"

import { readInheritableStaticArrayValues } from "./inheritable_statics"

type OutletObserverDetails = { outletName: string }

export interface OutletObserverDelegate {
  outletConnected(outlet: Controller, element: Element, outletName: string): void
  outletDisconnected(outlet: Controller, element: Element, outletName: string): void
}

export class OutletObserver implements AttributeObserverDelegate, SelectorObserverDelegate {
  started: boolean
  readonly context: Context
  readonly delegate: OutletObserverDelegate
  readonly outletsByName: Multimap<string, Controller>
  readonly outletElementsByName: Multimap<string, Element>
  private selectorObserverMap: Map<string, SelectorObserver>
  private attributeObserverMap: Map<string, AttributeObserver>

  constructor(context: Context, delegate: OutletObserverDelegate) {
    this.started = false
    this.context = context
    this.delegate = delegate
    this.outletsByName = new Multimap()
    this.outletElementsByName = new Multimap()
    this.selectorObserverMap = new Map()
    this.attributeObserverMap = new Map()
  }

  start() {
    if (!this.started) {
      this.outletDefinitions.forEach((outletName) => {
        this.setupSelectorObserverForOutlet(outletName)
        this.setupAttributeObserverForOutlet(outletName)
      })
      this.started = true
      this.dependentContexts.forEach((context) => context.refresh())
    }
  }

  refresh() {
    this.selectorObserverMap.forEach((observer) => observer.refresh())
    this.attributeObserverMap.forEach((observer) => observer.refresh())
  }

  stop() {
    if (this.started) {
      this.started = false
      this.disconnectAllOutlets()
      this.stopSelectorObservers()
      this.stopAttributeObservers()
    }
  }

  stopSelectorObservers() {
    if (this.selectorObserverMap.size > 0) {
      this.selectorObserverMap.forEach((observer) => observer.stop())
      this.selectorObserverMap.clear()
    }
  }

  stopAttributeObservers() {
    if (this.attributeObserverMap.size > 0) {
      this.attributeObserverMap.forEach((observer) => observer.stop())
      this.attributeObserverMap.clear()
    }
  }

  // Selector observer delegate

  selectorMatched(element: Element, _selector: string, { outletName }: OutletObserverDetails) {
    const outlet = this.getOutlet(element, outletName)

    if (outlet) {
      this.connectOutlet(outlet, element, outletName)
    }
  }

  selectorUnmatched(element: Element, _selector: string, { outletName }: OutletObserverDetails) {
    const outlet = this.getOutletFromMap(element, outletName)

    if (outlet) {
      this.disconnectOutlet(outlet, element, outletName)
    }
  }

  selectorMatchElement(element: Element, { outletName }: OutletObserverDetails) {
    const selector = this.selector(outletName)
    const hasOutlet = this.hasOutlet(element, outletName)
    const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`)

    if (selector) {
      return hasOutlet && hasOutletController && element.matches(selector)
    } else {
      return false
    }
  }

  // Attribute observer delegate

  elementMatchedAttribute(_element: Element, attributeName: string) {
    const outletName = this.getOutletNameFromOutletAttributeName(attributeName)

    if (outletName) {
      this.updateSelectorObserverForOutlet(outletName)
    }
  }

  elementAttributeValueChanged(_element: Element, attributeName: string) {
    const outletName = this.getOutletNameFromOutletAttributeName(attributeName)

    if (outletName) {
      this.updateSelectorObserverForOutlet(outletName)
    }
  }

  elementUnmatchedAttribute(_element: Element, attributeName: string) {
    const outletName = this.getOutletNameFromOutletAttributeName(attributeName)

    if (outletName) {
      this.updateSelectorObserverForOutlet(outletName)
    }
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
      this.selectorObserverMap
        .get(outletName)
        ?.pause(() => this.delegate.outletDisconnected(outlet, element, outletName))
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

  // Observer management

  private updateSelectorObserverForOutlet(outletName: string) {
    const observer = this.selectorObserverMap.get(outletName)

    if (observer) {
      observer.selector = this.selector(outletName)
    }
  }

  private setupSelectorObserverForOutlet(outletName: string) {
    const selector = this.selector(outletName)
    const selectorObserver = new SelectorObserver(document.body, selector!, this, { outletName })

    this.selectorObserverMap.set(outletName, selectorObserver)

    selectorObserver.start()
  }

  private setupAttributeObserverForOutlet(outletName: string) {
    const attributeName = this.attributeNameForOutletName(outletName)
    const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this)

    this.attributeObserverMap.set(outletName, attributeObserver)

    attributeObserver.start()
  }

  // Private

  private selector(outletName: string) {
    return this.scope.outlets.getSelectorForOutletName(outletName)
  }

  private attributeNameForOutletName(outletName: string) {
    return this.scope.schema.outletAttributeForScope(this.identifier, outletName)
  }

  private getOutletNameFromOutletAttributeName(attributeName: string) {
    return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName)
  }

  private get outletDependencies() {
    const dependencies = new Multimap<string, string>()

    this.router.modules.forEach((module) => {
      const constructor = module.definition.controllerConstructor
      const outlets = readInheritableStaticArrayValues(constructor, "outlets")

      outlets.forEach((outlet) => dependencies.add(outlet, module.identifier))
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
    return this.router.contexts.filter((context) => identifiers.includes(context.identifier))
  }

  private hasOutlet(element: Element, outletName: string) {
    return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName)
  }

  private getOutlet(element: Element, outletName: string) {
    return this.application.getControllerForElementAndIdentifier(element, outletName)
  }

  private getOutletFromMap(element: Element, outletName: string) {
    return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element)
  }

  private get scope() {
    return this.context.scope
  }

  private get schema() {
    return this.context.schema
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
