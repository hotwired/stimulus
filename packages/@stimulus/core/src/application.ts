import { Configuration, ConfigurationOptions, createConfiguration } from "./configuration"
import { Controller, ControllerConstructor } from "./controller"
import { Router } from "./router"

export type ErrorHandler = (error: Error, message: string, detail: object) => any

export class Application {
  readonly configuration: Configuration
  private router: Router
  errorHandler?: ErrorHandler

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
    this.router.register(identifier, controllerConstructor)
  }

  unregister(identifier: string) {
    this.router.unregister(identifier)
  }

  getControllerForElementAndIdentifier(element: Element, identifier: string): Controller | null {
    const context = this.router.getContextForElementAndIdentifier(element, identifier)
    return context ? context.controller : null
  }

  // Error handling

  setErrorHandler(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler
  }

  /** @private */
  handleError(error: Error, message: string, detail: object) {
    if (typeof this.errorHandler == "function") {
      this.errorHandler(error, message, detail)
    } else {
      console.error(`%s\n\n%o\n\n%o`, message, error, detail)
    }
  }
}
