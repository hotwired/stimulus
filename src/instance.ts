import { Context } from "./context"
import { Controller } from "./controller"
import { Region } from "./region"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { log, trace } from "./logger"

export class Instance {
  parentRegion: Region
  element: Element
  region: Region
  controllersByScope: Map<Scope, Controller>
  connectedControllers: Set<Controller>

  constructor(parentRegion: Region, element: Element) {
    this.parentRegion = parentRegion
    this.element = element
    this.region = new Region(parentRegion, this)
    this.controllersByScope = new Map()
    this.connectedControllers = new Set()
  }

  connectScope(scope: Scope) {
    const controller = this.fetchControllerForScope(scope)
    trace("connecting controller", controller)
    this.addScopes(scope.childScopes, scope)
    this.connectController(controller)
  }

  disconnectScope(scope: Scope) {
    const controller = this.getControllerForScope(scope)
    if (controller) {
      trace("disconnecting controller", controller)
      this.disconnectController(controller)
      this.deleteScopes(scope.childScopes)
    }
  }

  private addScopes(scopes: Scope[], parentScope: Scope) {
    for (const scope of scopes) {
      this.region.addScope(scope, parentScope)
    }
  }

  private deleteScopes(scopes: Scope[]) {
    for (const scope of scopes) {
      this.region.deleteScope(scope)
    }
  }

  private fetchControllerForScope(scope: Scope): Controller {
    let controller = this.controllersByScope.get(scope)
    if (!controller) {
      const parentController = this.getParentControllerForScope(scope) || null
      const context = new Context(parentController, this, scope)
      controller = new scope.controllerConstructor(context)
      log("created controller", controller)
      this.controllersByScope.set(scope, controller)
    }

    return controller
  }

  private getControllerForScope(scope: Scope): Controller | undefined {
    return this.controllersByScope.get(scope)
  }

  private getParentControllerForScope(scope: Scope): Controller | undefined {
    const parentScope = this.parentRegion.getParentForScope(scope)
    if (parentScope) {
      const parentInstance = this.parentRegion.instance
      if (parentInstance) {
        return parentInstance.getControllerForScope(parentScope)
      }
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

  private beforeConnectingFirstController() {
    log("instance will connect first controller", this)
    this.region.start()
  }

  private afterDisconnectingLastController() {
    log("instance did disconnect last controller", this)
    this.region.stop()
  }
}