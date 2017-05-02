import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Router } from "./router"

export class ContextSet {
  router: Router
  identifier: string
  controllerConstructor: ControllerConstructor

  private contextsByElement: WeakMap<Element, Context>
  private connectedContexts: Set<Context>

  constructor(router: Router, identifier: string, controllerConstructor: ControllerConstructor) {
    this.router = router
    this.identifier = identifier
    this.controllerConstructor = controllerConstructor

    this.contextsByElement = new WeakMap
    this.connectedContexts = new Set
  }

  get application(): Application {
    return this.router.application
  }

  get contexts(): Context[] {
    return Array.from(this.connectedContexts)
  }

  get size(): number {
    return this.connectedContexts.size
  }

  connect(element: Element) {
    const context = this.fetchContextForElement(element)
    if (context && !this.connectedContexts.has(context)) {
      this.connectedContexts.add(context)
      context.connect()
    }
  }

  disconnect(element: Element) {
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
