import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Definition, blessDefinition } from "./definition"
import { Scope } from "./scope"

export class Module {
  readonly application: Application
  readonly definition: Definition
  private contextsByScope: Map<Scope, Context>

  constructor(application: Application, definition: Definition) {
    this.application = application
    this.definition = blessDefinition(definition)
    this.contextsByScope = new Map
  }

  get identifier(): string {
    return this.definition.identifier
  }

  get controllerConstructor(): ControllerConstructor {
    return this.definition.controllerConstructor
  }

  get contexts(): Context[] {
    return Array.from(this.contextsByScope.values())
  }

  connectContextForScope(scope: Scope) {
    if (!this.contextsByScope.has(scope)) {
      const context = new Context(this, scope)
      this.contextsByScope.set(scope, context)
      context.connect()
    }
  }

  disconnectContextForScope(scope: Scope) {
    const context = this.contextsByScope.get(scope)
    if (context) {
      this.contextsByScope.delete(scope)
      context.disconnect()
    }
  }
}
