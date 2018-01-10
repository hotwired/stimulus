import { Controller, ControllerConstructor } from "./controller"
import { Definition } from "./definition"
import { Router } from "./router"
import { Schema, defaultSchema } from "./schema"

export class Application {
  readonly element: Element
  readonly schema: Schema
  private router: Router

  static start(element: Element = document.documentElement, schema: Schema = defaultSchema): Application {
    const application = new Application(element, schema)
    application.start()
    return application
  }

  constructor(element: Element, schema: Schema) {
    this.element = element
    this.schema = schema
    this.router = new Router(this)
  }

  start() {
    this.router.start()
  }

  stop() {
    this.router.stop()
  }

  register(identifier: string, controllerConstructor: ControllerConstructor) {
    this.load({ identifier, controllerConstructor })
  }

  load(...definitions: Definition[])
  load(definitions: Definition[])
  load(head: Definition | Definition[], ...rest: Definition[]) {
    const definitions = Array.isArray(head) ? head : [head, ...rest]
    definitions.forEach(definition => this.router.loadDefinition(definition))
  }

  unload(...identifiers: string[])
  unload(identifiers: string[])
  unload(head: string | string[], ...rest: string[]) {
    const identifiers = Array.isArray(head) ? head : [head, ...rest]
    identifiers.forEach(identifier => this.router.unloadIdentifier(identifier))
  }

  getControllerForElementAndIdentifier(element: Element, identifier: string): Controller | null {
    const context = this.router.getContextForElementAndIdentifier(element, identifier)
    return context ? context.controller : null
  }
}
