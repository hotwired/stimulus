import { SelectorObserver, SelectorObserverDelegate } from "./selector_observer"
import { Multimap } from "./multimap"
import { Selector } from "./selector"
import { Controller, ControllerConstructor } from "./controller"

export class Router implements SelectorObserverDelegate {
  selectorObserver: SelectorObserver
  constructors: Multimap<Selector, ControllerConstructor>
  controllers: WeakMap<Element, Map<Selector, Controller>> 

  constructor(element: Element) {
    this.selectorObserver = new SelectorObserver(element, this)
    this.constructors = new Multimap<Selector, ControllerConstructor>()
    this.controllers = new WeakMap<Element, Map<Selector, Controller>>()
  }

  start() {
    this.selectorObserver.start()
  }

  stop() {
    this.selectorObserver.stop()
  }

  get element(): Element {
    return this.selectorObserver.element
  }

  // Route registration

  register(selector, constructor: ControllerConstructor) {
    selector = Selector.get(selector)
    this.constructors.add(selector, constructor)
    this.selectorObserver.observeSelector(selector)
  }

  // Selector observer delegate

  elementMatchedSelector(element: Element, selector: Selector) {
    const constructors = this.constructors.getValuesForKey(selector)
    if (constructors) {
      for (const constructor of constructors) {
        const controller = new constructor(selector, element)
        if (this.addController(element, selector, controller)) {
          controller.matched()
        }
      }
    }
  }

  elementUnmatchedSelector(element: Element, selector: Selector) {
    const controller = this.deleteController(element, selector)
    if (controller) {
      controller.unmatched()
    }
  }

  // Controller bookkeeping

  addController(element: Element, selector: Selector, controller: Controller): boolean {
    let controllers: Map<Selector, Controller>
    
    if (this.controllers.has(element)) {
      controllers = this.controllers.get(element)!
    } else {
      controllers = new Map<Selector, Controller>()
      this.controllers.set(element, controllers)
    }

    if (!controllers.has(selector)) {
      controllers.set(selector, controller)
      return true
    } else {
      return false
    }
  }

  deleteController(element: Element, selector: Selector): Controller | undefined {
    if (this.controllers.has(element)) {
      const controllers = this.controllers.get(element)!
      const controller = controllers.get(selector)
      controllers.delete(selector)
      return controller
    }
  }
}
