import { Controller } from "./controller"
import { Scope } from "./scope"
import { Selector } from "./selector"

export class Instance {
  element: Element
  selector: Selector
  controllers: Map<Scope, Controller>

  constructor(element: Element, selector: Selector) {
    this.element = element
    this.selector = selector
    this.controllers = new Map()
  }

  connectControllerForScope(scope: Scope) {
    const controller = this.fetchControllerForScope(scope)
    controller.connect()
  }

  disconnectControllerForScope(scope: Scope) {
    const controller = this.getControllerForScope(scope)
    if (controller) {
      controller.disconnect()
    }    
  }

  getControllerForScope(scope: Scope): Controller | undefined {
    return this.controllers.get(scope)
  }

  fetchControllerForScope(scope: Scope): Controller {
    let controller = this.controllers.get(scope)
    if (!controller) {
      controller = new scope.controllerConstructor(this.element)
      this.controllers.set(scope, controller)
    }

    return controller
  }
}