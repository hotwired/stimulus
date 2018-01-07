import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Definition } from "./definition"
import { Router } from "./router"

export class Module {
  readonly router: Router
  readonly definition: Definition

  private contextsByElement: WeakMap<Element, Context>
  private connectedContexts: Set<Context>

  constructor(router: Router, definition: Definition) {
    this.router = router
    this.definition = Object.assign({}, definition)
    this.contextsByElement = new WeakMap
    this.connectedContexts = new Set
  }

  get application(): Application {
    return this.router.application
  }

  get identifier(): string {
    return this.definition.identifier
  }

  get controllerConstructor(): ControllerConstructor {
    return this.definition.controllerConstructor
  }

  get contexts(): Context[] {
    return Array.from(this.connectedContexts)
  }

  get size(): number {
    return this.connectedContexts.size
  }

  connectElement(element: Element) {
    const context = this.fetchContextForElement(element)
    if (context && !this.connectedContexts.has(context)) {
      this.connectedContexts.add(context)
      context.connect()
    }
  }

  disconnectElement(element: Element) {
    const context = this.fetchContextForElement(element)
    if (context && this.connectedContexts.has(context)) {
      this.connectedContexts.delete(context)
      context.disconnect()
    }
  }

  getContextForElement(element: Element): Context | undefined {
    return this.contextsByElement.get(element)
  }

  private fetchContextForElement(element: Element): Context {
    let context = this.contextsByElement.get(element)
    if (!context) {
      context = new Context(this, element)
      this.contextsByElement.set(element, context)
    }
    return context
  }
}
