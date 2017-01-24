import { TokenListObserver, TokenListObserverDelegate } from "./token_list_observer"
import { Controller, ControllerConstructor } from "./controller"

type ControllerMap = Map<string, Controller>

export class Router implements TokenListObserverDelegate {
  private tokenListObserver: TokenListObserver
  private controllerConstructors: Map<string, ControllerConstructor>
  private controllerMaps: WeakMap<Element, ControllerMap>
  private connectedControllers: Set<Controller>

  constructor(element: Element) {
    this.tokenListObserver = new TokenListObserver(element, "data-controller", this)
    this.controllerConstructors = new Map()
    this.controllerMaps = new WeakMap()
    this.connectedControllers = new Set()
  }

  get element(): Element {
    return this.tokenListObserver.element
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  // Controllers

  register(name: string, controllerConstructor: ControllerConstructor) {
    if (this.controllerConstructors.has(name)) {
      throw new Error(`Router already has a controller registered with the name '${name}'`)
    }

    this.controllerConstructors.set(name, controllerConstructor)
    this.connectControllers(name)
  }

  private connectControllers(name: string) {
    const elements = this.tokenListObserver.getElementsMatchingToken(name)
    for (const element of elements) {
      this.connectControllerForElement(name, element)
    }
  }

  private connectControllerForElement(name: string, element: Element) {
    const controller = this.fetchControllerForElement(name, element)
    if (controller && !this.connectedControllers.has(controller)) {
      this.connectedControllers.add(controller)
      controller.connect()
    }
  }

  private disconnectControllerForElement(name: string, element: Element) {
    const controller = this.fetchControllerForElement(name, element)
    if (controller && this.connectedControllers.has(controller)) {
      this.connectedControllers.delete(controller)
      controller.disconnect()
    }
  }

  private fetchControllerForElement(name: string, element: Element): Controller | undefined {
    const constructor = this.controllerConstructors.get(name)
    if (constructor) {
      const controllerMap = this.fetchControllerMapForElement(element)
      let controller = controllerMap.get(name)

      if (!controller) {
        controller = new constructor(element)
        controllerMap.set(name, controller)
      }

      return controller
    }
  }

  private fetchControllerMapForElement(element: Element): ControllerMap {
    let controllerMap = this.controllerMaps.get(element)
    if (!controllerMap) {
      controllerMap = new Map()
      this.controllerMaps.set(element, controllerMap)
    }

    return controllerMap
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.connectControllerForElement(token, element)
  }

  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.disconnectControllerForElement(token, element)
  }
}
