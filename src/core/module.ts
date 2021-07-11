import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Definition, blessDefinition } from "./definition"
import { Scope } from "./scope"

export class Module {
  readonly application: Application
  readonly definition: Definition
  private contextsByScope: WeakMap<Scope, Context>
  private connectedContexts: Set<Context>

  constructor(application: Application, definition: Definition) {
    this.application = application
    this.definition = blessDefinition(definition)
    this.contextsByScope = new WeakMap
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

  connectContextForScope(scope: Scope) {
    const context = this.fetchContextForScope(scope)
    this.connectedContexts.add(context)
    context.connect()
  }

  disconnectContextForScope(scope: Scope) {
    const context = this.contextsByScope.get(scope)
    if (context) {
      this.connectedContexts.delete(context)
      context.disconnect()
    }
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
