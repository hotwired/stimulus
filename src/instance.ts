import { Controller } from "./controller"
import { Scope } from "./scope"
import { Selector } from "./selector"

export class Instance {
  element: Element
  controllersByScope: Map<Scope, Controller>
  connectedControllers: Set<Controller>

  constructor(element: Element) {
    this.element = element
    this.controllersByScope = new Map()
    this.connectedControllers = new Set()
  }

  connectScope(scope: Scope) {
    const controller = this.fetchControllerForScope(scope)
    this.connectedControllers.add(controller)
    controller.connect()
  }

  disconnectScope(scope: Scope) {
    const controller = this.getControllerForScope(scope)
    if (controller) {
      this.connectedControllers.delete(controller)
      controller.disconnect()
    }
  }

  // Private

  private getControllerForScope(scope: Scope): Controller | undefined {
    return this.controllersByScope.get(scope)
  }

  private fetchControllerForScope(scope: Scope): Controller {
    let controller = this.controllersByScope.get(scope)
    if (!controller) {
      controller = new scope.controllerConstructor(this.element)
      this.controllersByScope.set(scope, controller)
    }

    return controller
  }
}