import { Application } from "./application"
import { Configuration } from "./configuration"
import { Context } from "./context"
import { ContextSet } from "./context_set"
import { Controller, ControllerConstructor } from "./controller"
import { TokenListObserver, TokenListObserverDelegate } from "@stimulus/mutation-observers"

export class Router implements TokenListObserverDelegate {
  application: Application
  private tokenListObserver: TokenListObserver
  private contextSetsByIdentifier: Map<string, ContextSet>

  constructor(application: Application) {
    this.application = application
    this.tokenListObserver = new TokenListObserver(this.element, this.controllerAttribute, this)
    this.contextSetsByIdentifier = new Map
  }

  get configuration(): Configuration {
    return this.application.configuration
  }

  get element(): Element {
    return this.configuration.rootElement
  }

  get controllerAttribute(): string {
    return this.configuration.controllerAttribute
  }

  get controllers(): Controller[] {
    return this.contextSets.reduce((contextSets, contextSet) => contextSets.concat(contextSet.controllers), [] as Controller[])
  }

  get contextSets(): ContextSet[] {
    return Array.from(this.contextSetsByIdentifier.values())
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  register(identifier: string, controllerConstructor: ControllerConstructor) {
    if (this.contextSetsByIdentifier.has(identifier)) {
      throw new Error(`Router already has a controller registered with the identifier '${identifier}'`)
    }

    const contextSet = new ContextSet(this, identifier, controllerConstructor)
    this.contextSetsByIdentifier.set(identifier, contextSet)
    this.connectContextSet(contextSet)
  }

  unregister(identifier: string) {
    const contextSet = this.contextSetsByIdentifier.get(identifier)
    if (contextSet) {
      this.disconnectContextSet(contextSet)
      this.contextSetsByIdentifier.delete(identifier)
    }
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.connectContextForIdentifierToElement(token, element)
  }

  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.disconnectContextForIdentifierFromElement(token, element)
  }

  // Contexts

  getContextForElementAndIdentifier(element: Element, identifier: string): Context | undefined {
    const contextSet = this.contextSetsByIdentifier.get(identifier)
    if (contextSet) {
      return contextSet.getContextForElement(element)
    }
  }

  private connectContextSet(contextSet: ContextSet) {
    const elements = this.tokenListObserver.getElementsMatchingToken(contextSet.identifier)
    for (const element of elements) {
      contextSet.connect(element)
    }
  }

  private disconnectContextSet(contextSet: ContextSet) {
    const contexts = contextSet.contexts
    for (const { element } of contexts) {
      contextSet.disconnect(element)
    }
  }

  private connectContextForIdentifierToElement(identifier: string, element: Element) {
    const contextSet = this.contextSetsByIdentifier.get(identifier)
    if (contextSet) {
      contextSet.connect(element)
    }
  }

  private disconnectContextForIdentifierFromElement(identifier: string, element: Element) {
    const contextSet = this.contextSetsByIdentifier.get(identifier)
    if (contextSet) {
      contextSet.disconnect(element)
    }
  }
}
