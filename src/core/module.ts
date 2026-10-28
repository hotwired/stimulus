import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Definition, blessDefinition } from "./definition"
import { Scope } from "./scope"

export class Module {
  readonly application: Application
  readonly definition: Definition
  private contextsByScope: WeakMap<Scope, Context>
  private connectedContextsByElement: Map<Element, Context>

  constructor(application: Application, definition: Definition) {
    this.application = application
    this.definition = blessDefinition(definition)
    this.contextsByScope = new WeakMap()
    this.connectedContextsByElement = new Map()
  }

  get identifier(): string {
    return this.definition.identifier
  }

  get controllerConstructor(): ControllerConstructor {
    return this.definition.controllerConstructor
  }

  get contexts(): Context[] {
    return Array.from(this.connectedContextsByElement.values())
  }

  connectContextForScope(scope: Scope) {
    const context = this.fetchContextForScope(scope)
    this.connectedContextsByElement.set(scope.element, context)
    context.connect()
  }

  disconnectContextForScope(scope: Scope) {
    const context = this.contextsByScope.get(scope)
    if (context) {
      this.connectedContextsByElement.delete(scope.element)
      context.disconnect()
    }
  }

  getConnectedContextForElement(element: Element): Context | undefined {
    return this.connectedContextsByElement.get(element)
  }

  private fetchContextForScope(scope: Scope): Context {
    let context = this.contextsByScope.get(scope)
    if (!context) {
      context = new Context(this, scope)
      this.contextsByScope.set(scope, context)
    }
    return context
  }
}
