import { Configuration, ConfigurationOptions, createConfiguration } from "./configuration"
import { Controller, ControllerConstructor } from "./controller"
import { Definition } from "./definition"
import { Router } from "./router"

export class Application {
  readonly configuration: Configuration
  private router: Router

  static start(configurationOptions?: ConfigurationOptions): Application {
    const application = new Application(configurationOptions)
    application.start()
    return application
  }

  constructor(configurationOptions: ConfigurationOptions = {}) {
    this.configuration = createConfiguration(configurationOptions)
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

  // Error handling

  handleError(error: Error, message: string, detail: object) {
    console.error(`%s\n\n%o\n\n%o`, message, error, detail)
  }
}
