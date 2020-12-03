import { Controller, ControllerConstructor } from "./controller"
import { Definition } from "./definition"
import { Dispatcher } from "./dispatcher"
import { ErrorHandler } from "./error_handler"
import { Logger } from "./logger"
import { Router } from "./router"
import { Schema, defaultSchema } from "./schema"

export class Application implements ErrorHandler {
  readonly element: Element
  readonly schema: Schema
  readonly dispatcher: Dispatcher
  readonly router: Router
  logger: Logger = console

  static start(element?: Element, schema?: Schema): Application {
    const application = new Application(element, schema)
    application.start()
    return application
  }

  constructor(element: Element = document.documentElement, schema: Schema = defaultSchema) {
    this.element = element
    this.schema = schema
    this.dispatcher = new Dispatcher(this)
    this.router = new Router(this)
  }

  async start() {
    await domReady()
    this.dispatcher.start()
    this.router.start()
  }

  stop() {
    this.dispatcher.stop()
    this.router.stop()
  }

  register(identifier: string, controllerConstructor: ControllerConstructor) {
    this.load({ identifier, controllerConstructor })
  }

  load(...definitions: Definition[]): void
  load(definitions: Definition[]): void
  load(head: Definition | Definition[], ...rest: Definition[]) {
    const definitions = Array.isArray(head) ? head : [head, ...rest]
    definitions.forEach(definition => this.router.loadDefinition(definition))
  }

  unload(...identifiers: string[]): void
  unload(identifiers: string[]): void
  unload(head: string | string[], ...rest: string[]) {
    const identifiers = Array.isArray(head) ? head : [head, ...rest]
    identifiers.forEach(identifier => this.router.unloadIdentifier(identifier))
  }

  // Controllers

  get controllers(): Controller[] {
    return this.router.contexts.map(context => context.controller)
  }

  getControllerForElementAndIdentifier(element: Element, identifier: string): Controller | null {
    const context = this.router.getContextForElementAndIdentifier(element, identifier)
    return context ? context.controller : null
  }

  // Error handling

  handleError(error: Error, message: string, detail: object) {
    this.logger.error(`%s\n\n%o\n\n%o`, message, error, detail)
  }
}

function domReady(): Promise<any> {
  return new Promise(resolve => {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", resolve)
    } else {
      resolve()
    }
  })
}
