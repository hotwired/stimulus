import { Application } from "./application"
import { Configuration } from "./configuration"
import { Context } from "./context"
import { Definition } from "./definition"
import { Module } from "./module"
import { TokenListObserver, TokenListObserverDelegate } from "@stimulus/mutation-observers"

export class Router implements TokenListObserverDelegate {
  readonly application: Application
  private tokenListObserver: TokenListObserver
  private modules: Map<string, Module>

  constructor(application: Application) {
    this.application = application
    this.tokenListObserver = new TokenListObserver(this.element, this.controllerAttribute, this)
    this.modules = new Map
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

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  load(definition: Definition) {
    const { identifier } = definition
    this.unload(identifier)

    const module = new Module(this, definition)
    this.modules.set(identifier, module)
    this.connectModule(module)
  }

  unload(identifier: string) {
    const module = this.modules.get(identifier)
    if (module) {
      this.disconnectModule(module)
      this.modules.delete(identifier)
    }
  }

  // Token list observer delegate

  /** @private */
  elementMatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.connectModuleForIdentifierToElement(token, element)
  }

  /** @private */
  elementUnmatchedTokenForAttribute(element: Element, token: string, attributeName: string) {
    this.disconnectModuleForIdentifierFromElement(token, element)
  }

  // Contexts

  getContextForElementAndIdentifier(element: Element, identifier: string): Context | undefined {
    const module = this.modules.get(identifier)
    if (module) {
      return module.getContextForElement(element)
    }
  }

  private connectModule(module: Module) {
    const elements = this.tokenListObserver.getElementsMatchingToken(module.identifier)
    for (const element of elements) {
      module.connectElement(element)
    }
  }

  private disconnectModule(module: Module) {
    const contexts = module.contexts
    for (const { element } of contexts) {
      module.disconnectElement(element)
    }
  }

  private connectModuleForIdentifierToElement(identifier: string, element: Element) {
    const module = this.modules.get(identifier)
    if (module) {
      module.connectElement(element)
    }
  }

  private disconnectModuleForIdentifierFromElement(identifier: string, element: Element) {
    const module = this.modules.get(identifier)
    if (module) {
      module.disconnectElement(element)
    }
  }
}
