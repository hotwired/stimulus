import { TokenListObserver, TokenListObserverDelegate } from "sentinella"
import { ControllerConstructor } from "./controller"
import { X, XDelegate } from "./x"
import { Mask } from "./mask"

type XMap = Map<string, X>

export class Router implements TokenListObserverDelegate, XDelegate {
  private attributeName: string
  private tokenListObserver: TokenListObserver
  private controllerConstructors: Map<string, ControllerConstructor>
  private xMaps: WeakMap<Element, XMap>
  private connectedXs: Set<X>
  private masks: WeakMap<Element, Mask>

  constructor(element: Element, attributeName: string) {
    this.attributeName = attributeName
    this.tokenListObserver = new TokenListObserver(element, attributeName, this)
    this.controllerConstructors = new Map()
    this.xMaps = new WeakMap()
    this.connectedXs = new Set()
    this.masks = new WeakMap()
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
    this.connectXs(identifier)
  }

  private connectXs(identifier: string) {
    const elements = this.tokenListObserver.getElementsMatchingToken(identifier)
    for (const element of elements) {
      this.connectXForElement(identifier, element)
    }
  }

  private connectXForElement(identifier: string, element: Element) {
    const x = this.fetchXForElement(identifier, element)
    if (x && !this.connectedXs.has(x)) {
      this.connectedXs.add(x)
      this.resetMasksForIdentifier(identifier)
      x.connect()
    }
  }

  private disconnectXForElement(identifier: string, element: Element) {
    const x = this.fetchXForElement(identifier, element)
    if (x && this.connectedXs.has(x)) {
      this.connectedXs.delete(x)
      this.resetMasksForIdentifier(identifier)
      x.disconnect()
    }
  }

  private getConnectedXsForIdentifier(identifier: string) {
    return Array.from(this.connectedXs).filter(x => x.identifier == identifier)
  }

  private fetchXForElement(identifier: string, element: Element): X | undefined {
    const constructor = this.controllerConstructors.get(identifier)
    if (constructor) {
      const xMap = this.fetchXMapForElement(element)
      let x = xMap.get(identifier)

      if (!x) {
        x = new X(identifier, element, constructor, this)
        xMap.set(identifier, x)
      }

      return x
    }
  }

  private fetchXMapForElement(element: Element): XMap {
    let xMap = this.xMaps.get(element)
    if (!xMap) {
      xMap = new Map()
      this.xMaps.set(element, xMap)
    }

    return xMap
  }

  // Masks

  private fetchMaskForElement(identifier: string, element: Element): Mask {
    let mask = this.masks.get(element)
    if (!mask) {
      const selector = `[${this.attributeName}='${identifier}']`
      mask = Mask.forElementWithSelector(element, selector)
      this.masks.set(element, mask)
    }

    return mask
  }

  private resetMasksForIdentifier(identifier: string) {
    const controllers = this.getConnectedXsForIdentifier(identifier)
    for (const controller of controllers) {
      this.masks.delete(controller.element)
    }
  }

  // Controller delegate

  controllerCanControlElement(controller: X, element: Element): boolean {
    const mask = this.fetchMaskForElement(controller.identifier, controller.element)
    return !mask.masks(element)
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.connectXForElement(token, element)
  }

  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.disconnectXForElement(token, element)
  }
}
