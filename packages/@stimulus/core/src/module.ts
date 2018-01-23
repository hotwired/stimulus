import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Definition, blessDefinition } from "./definition"

export class Module {
  readonly application: Application
  readonly definition: Definition

  private contextsByElement: WeakMap<Element, Context>
  private connectedContexts: Set<Context>

  constructor(application: Application, definition: Definition) {
    this.application = application
    this.definition = blessDefinition(definition)
    this.contextsByElement = new WeakMap
    this.connectedContexts = new Set
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
