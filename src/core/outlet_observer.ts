import { Multimap } from "../multimap"
import { Token, TokenListObserver, TokenListObserverDelegate } from "../mutation-observers"
import { Context } from "./context"
import { Controller } from "./controller"

import { readInheritableStaticArrayValues } from "./inheritable_statics"

export interface OutletObserverDelegate {
  outletConnected(outlet: Controller, element: Element, name: string): void
  outletDisconnected(outlet: Controller, element: Element, name: string): void
}

export class OutletObserver implements TokenListObserverDelegate {
  readonly context: Context
  readonly delegate: OutletObserverDelegate
  readonly outletsByName: Multimap<string, Controller>
  readonly outletElementsByName: Multimap<string, Element>
  private tokenListObserver?: TokenListObserver

  constructor(context: Context, delegate: OutletObserverDelegate) {
    this.context = context
    this.delegate = delegate
    this.outletsByName = new Multimap()
    this.outletElementsByName = new Multimap()
  }

  start() {
    if (!this.tokenListObserver) {
      this.tokenListObserver = new TokenListObserver(document.body, this.attributeName, this)
      this.tokenListObserver.start()
      this.invokeConnectCallbacksForAlreadyConnectedOutlets()
    }
  }

  stop() {
    if (this.tokenListObserver) {
      this.disconnectAllOutlets()
      this.tokenListObserver.stop()
      delete this.tokenListObserver
    }
  }

  // Token list observer delegate

  tokenMatched({ element, content: name }: Token) {
    if (this.outletDefinitions.includes(name) && this.matches(element, name)) {
      const outlet = this.getOutlet(element, name)

      if (outlet) {
        this.connectOutlet(outlet, element, name)
      }
    }
  }

  tokenUnmatched({ element, content: name }: Token) {
    if (this.outletDefinitions.includes(name) && this.matches(element, name)) {
      const outlet = this.outletsByName.getValuesForKey(name).find(outlet => outlet.element === element)

      if (outlet) {
        this.disconnectOutlet(outlet, element, name)
      }
    }
  }

  // Outlet management

  connectOutlet(outlet: Controller, element: Element, name: string) {
    if (!this.outletElementsByName.has(name, element)) {
      this.outletsByName.add(name, outlet)
      this.outletElementsByName.add(name, element)
      this.tokenListObserver?.pause(() => this.delegate.outletConnected(outlet, element, name))
    }
  }

  disconnectOutlet(outlet: Controller, element: Element, name: string) {
    if (this.outletElementsByName.has(name, element)) {
      this.outletsByName.delete(name, outlet)
      this.outletElementsByName.delete(name, element)
      this.tokenListObserver?.pause(() => this.delegate.outletDisconnected(outlet, element, name))
    }
  }

  disconnectAllOutlets() {
    for (const name of this.outletElementsByName.keys) {
      for (const element of this.outletElementsByName.getValuesForKey(name)) {
        for (const outlet of this.outletsByName.getValuesForKey(name)) {
          this.disconnectOutlet(outlet, element, name)
        }
      }
    }
  }

  // Private

  private getOutlet(element: Element, name: string) {
    return this.context.application.getControllerForElementAndIdentifier(element, name)
  }

  private invokeConnectCallbacksForAlreadyConnectedOutlets() {
    for (const name of this.outletDefinitions) {
      const elements = this.context.scope.outlets.findAll(name)

      elements.forEach(element => {
        const outlet = this.getOutlet(element, name)

        if (outlet) {
          this.connectOutlet(outlet, element, name)
        }
      })
    }
  }

  private matches(element: Element, outletName: string) {
    const selector = this.selector(outletName)

    if (!selector) return false

    return element.matches(selector)
  }

  private get outletDefinitions() {
    return readInheritableStaticArrayValues(this.context.controller.constructor as any, "outlets")
  }

  private get attributeName() {
    return this.scope.schema.controllerAttribute
  }

  private selector(outletName: string) {
    return this.scope.outlets.getSelectorForOutletName(outletName)
  }

  private get scope() {
    return this.context.scope
  }
}
