import { Application } from "./application"
import { Context } from "./context"
import { Definition } from "./definition"
import { Module } from "./module"
import { Schema } from "./schema"
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

  get schema(): Schema {
    return this.application.schema
  }

  get element(): Element {
    return this.application.element
  }

  get controllerAttribute(): string {
    return this.schema.controllerAttribute
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  loadDefinition(definition: Definition) {
    const { identifier } = definition
    this.unloadIdentifier(identifier)

    const module = new Module(this.application, definition)
    this.modules.set(identifier, module)
    this.connectModule(module)
  }

  unloadIdentifier(identifier: string) {
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
