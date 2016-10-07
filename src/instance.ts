import { Controller } from "./controller"
import { Region } from "./region"
import { Scope } from "./scope"
import { Selector } from "./selector"

export class Instance {
  parentRegion: Region
  element: Element
  region: Region
  controllersByScope: Map<Scope, Controller>
  connectedControllers: Set<Controller>

  constructor(parentRegion: Region, element: Element) {
    this.parentRegion = parentRegion
    this.element = element
    this.region = new Region(element)
    this.controllersByScope = new Map()
    this.connectedControllers = new Set()
  }

  connectScope(scope: Scope) {
    const controller = this.fetchControllerForScope(scope)
    this.connectedControllers.add(controller)
    controller.connect()
    this.addScopes(scope.childScopes)
    this.connectController(controller)
  }

  disconnectScope(scope: Scope) {
    const controller = this.getControllerForScope(scope)
    if (controller) {
      this.connectedControllers.delete(controller)
      controller.disconnect()
      this.disconnectController(controller)
      this.deleteScopes(scope.childScopes)
    }
  }

  // Controllers

  private connectController(controller: Controller) {
    if (this.connectedControllers.size == 0) {
      this.beforeConnectingFirstController()
    }

    this.connectedControllers.add(controller)
    controller.connect()
  }

  private disconnectController(controller: Controller) {
    this.connectedControllers.delete(controller)
    controller.disconnect()

    if (this.connectedControllers.size == 0) {
      this.afterDisconnectingLastController()
    }
  }

  // Scopes

  private addScopes(scopes: Scope[]) {
    for (const scope of scopes) {
      this.region.addScope(scope)
    }
  }

  private deleteScopes(scopes: Scope[]) {
    for (const scope of scopes) {
      this.region.deleteScope(scope)
    }
  }

  // Regions

  private beforeConnectingFirstController() {
    this.region.start()
  }

  private afterDisconnectingLastController() {
    this.region.stop()
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