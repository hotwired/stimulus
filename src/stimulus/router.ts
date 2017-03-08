import { TokenListObserver, TokenListObserverDelegate } from "sentinella"
import { Controller, ControllerConstructor } from "./controller"

type ControllerMap = Map<string, Controller>

export class Router implements TokenListObserverDelegate {
  private attributeName: string
  private tokenListObserver: TokenListObserver
  private controllerConstructors: Map<string, ControllerConstructor>
  private controllerMaps: WeakMap<Element, ControllerMap>
  private connectedControllers: Set<Controller>

  constructor(element: Element, attributeName: string) {
    this.attributeName = attributeName
    this.tokenListObserver = new TokenListObserver(element, attributeName, this)
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

  register(identifier: string, controllerConstructor: ControllerConstructor) {
    if (this.controllerConstructors.has(identifier)) {
      throw new Error(`Router already has a controller registered with the identifier '${identifier}'`)
    }

    this.controllerConstructors.set(identifier, controllerConstructor)
    this.connectControllers(identifier)
  }

  private connectControllers(identifier: string) {
    const elements = this.tokenListObserver.getElementsMatchingToken(identifier)
    for (const element of elements) {
      this.connectControllerForElement(identifier, element)
    }
  }

  private connectControllerForElement(identifier: string, element: Element) {
    const controller = this.fetchControllerForElement(identifier, element)
    if (controller && !this.connectedControllers.has(controller)) {
      this.connectedControllers.add(controller)
      controller.connect()
    }
  }

  private disconnectControllerForElement(identifier: string, element: Element) {
    const controller = this.fetchControllerForElement(identifier, element)
    if (controller && this.connectedControllers.has(controller)) {
      this.connectedControllers.delete(controller)
      controller.disconnect()
    }
  }

  private fetchControllerForElement(identifier: string, element: Element): Controller | undefined {
    const constructor = this.controllerConstructors.get(identifier)
    if (constructor) {
      const controllerMap = this.fetchControllerMapForElement(element)
      let controller = controllerMap.get(identifier)

      if (!controller) {
        controller = new constructor(identifier, element, this.attributeName)
        controllerMap.set(identifier, controller)
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
