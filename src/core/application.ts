import { Controller, ControllerConstructor } from "./controller"
import { Definition } from "./definition"
import { Dispatcher } from "./dispatcher"
import { ErrorHandler } from "./error_handler"
import { Logger } from "./logger"
import { Router } from "./router"
import { Schema, defaultSchema } from "./schema"
import { ActionDescriptorFilter, ActionDescriptorFilters, defaultActionDescriptorFilters } from "./action_descriptor"

export class Application implements ErrorHandler {
  readonly element: Element
  readonly schema: Schema
  readonly dispatcher: Dispatcher
  readonly router: Router
  readonly actionDescriptorFilters: ActionDescriptorFilters
  logger: Logger = console
  debug: boolean = false

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
    this.actionDescriptorFilters = { ...defaultActionDescriptorFilters }
  }

  async start() {
    await domReady()
    this.logDebugActivity("application", "starting")
    this.dispatcher.start()
    this.router.start()
    this.logDebugActivity("application", "start")
  }

  stop() {
    this.logDebugActivity("application", "stopping")
    this.dispatcher.stop()
    this.router.stop()
    this.logDebugActivity("application", "stop")
  }

  register(identifier: string, controllerConstructor: ControllerConstructor) {
    this.load({ identifier, controllerConstructor })
  }

  registerActionOption(name: string, filter: ActionDescriptorFilter) {
    this.actionDescriptorFilters[name] = filter
  }

  load(...definitions: Definition[]): void
  load(definitions: Definition[]): void
  load(head: Definition | Definition[], ...rest: Definition[]) {
    const definitions = Array.isArray(head) ? head : [head, ...rest]
    definitions.forEach(definition => {
      if ((definition.controllerConstructor as any).shouldLoad) {
        this.router.loadDefinition(definition)
      }
    })
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

    window.onerror?.(message, "", 0, 0, error)
  }

  // Debug logging

  logDebugActivity = (identifier: string, functionName: string, detail: object = {}): void => {
    if (this.debug) {
      this.logFormattedMessage(identifier, functionName, detail)
    }
  }

  private logFormattedMessage(identifier: string, functionName: string, detail: object = {}) {
    detail = Object.assign({ application: this }, detail)

    this.logger.groupCollapsed(`${identifier} #${functionName}`)
    this.logger.log("details:", { ...detail })
    this.logger.groupEnd()
  }
}

function domReady() {
  return new Promise<void>(resolve => {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve())
    } else {
      resolve()
    }
  })
}
