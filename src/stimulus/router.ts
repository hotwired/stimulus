import { Configuration } from "./configuration"
import { TokenListObserver, TokenListObserverDelegate } from "sentinella"
import { ControllerConstructor } from "./controller"
import { Context, ContextDelegate } from "./context"
import { Mask } from "./mask"

type ContextMap = Map<string, Context>

export class Router implements TokenListObserverDelegate, ContextDelegate {
  private configuration: Configuration
  private tokenListObserver: TokenListObserver
  private controllerConstructors: Map<string, ControllerConstructor>
  private contextMaps: WeakMap<Element, ContextMap>
  private connectedContexts: Set<Context>
  private masks: WeakMap<Element, Mask>

  constructor(configuration: Configuration) {
    this.configuration = configuration
    this.tokenListObserver = new TokenListObserver(this.element, this.controllerAttribute, this)
    this.controllerConstructors = new Map()
    this.contextMaps = new WeakMap()
    this.connectedContexts = new Set()
    this.masks = new WeakMap()
  }

  get element(): Element {
    return this.configuration.rootElement
  }

  get controllerAttribute(): string {
    return this.configuration.controllerAttribute
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
    this.connectContexts(identifier)
  }

  private connectContexts(identifier: string) {
    const elements = this.tokenListObserver.getElementsMatchingToken(identifier)
    for (const element of elements) {
      this.connectContextForElement(identifier, element)
    }
  }

  private connectContextForElement(identifier: string, element: Element) {
    const context = this.fetchContextForElement(identifier, element)
    if (context && !this.connectedContexts.has(context)) {
      this.connectedContexts.add(context)
      this.resetMasksForIdentifier(identifier)
      context.connect()
    }
  }

  private disconnectContextForElement(identifier: string, element: Element) {
    const context = this.fetchContextForElement(identifier, element)
    if (context && this.connectedContexts.has(context)) {
      this.connectedContexts.delete(context)
      this.resetMasksForIdentifier(identifier)
      context.disconnect()
    }
  }

  private getConnectedContextsForIdentifier(identifier: string) {
    return Array.from(this.connectedContexts).filter(context => context.identifier == identifier)
  }

  private fetchContextForElement(identifier: string, element: Element): Context | undefined {
    const constructor = this.controllerConstructors.get(identifier)
    if (constructor) {
      const contextMap = this.fetchContextMapForElement(element)
      let context = contextMap.get(identifier)

      if (!context) {
        context = new Context(identifier, element, constructor, this)
        contextMap.set(identifier, context)
      }

      return context
    }
  }

  private fetchContextMapForElement(element: Element): ContextMap {
    let contextMap = this.contextMaps.get(element)
    if (!contextMap) {
      contextMap = new Map()
      this.contextMaps.set(element, contextMap)
    }

    return contextMap
  }

  // Masks

  private fetchMaskForElement(identifier: string, element: Element): Mask {
    let mask = this.masks.get(element)
    if (!mask) {
      const selector = `[${this.controllerAttribute}='${identifier}']`
      mask = Mask.forElementWithSelector(element, selector)
      this.masks.set(element, mask)
    }

    return mask
  }

  private resetMasksForIdentifier(identifier: string) {
    const controllers = this.getConnectedContextsForIdentifier(identifier)
    for (const controller of controllers) {
      this.masks.delete(controller.element)
    }
  }

  // Context delegate

  contextCanControlElement(context: Context, element: Element): boolean {
    const mask = this.fetchMaskForElement(context.identifier, context.element)
    return !mask.masks(element)
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.connectContextForElement(token, element)
  }

  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.disconnectContextForElement(token, element)
  }
}
