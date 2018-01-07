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

  load(definition: Definition) {
    this.router.load(definition)
  }

  unload(identifier: string) {
    this.router.unload(identifier)
  }

  getControllerForElementAndIdentifier(element: Element, identifier: string): Controller | null {
    const context = this.router.getContextForElementAndIdentifier(element, identifier)
    return context ? context.controller : null
  }
}
