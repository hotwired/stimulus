import { Configuration, ConfigurationOptions, createConfiguration } from "./configuration"
import { ControllerConstructor } from "./controller"
import { Router } from "./router"

export class Application {
  configuration: Configuration
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
    this.router.register(identifier, controllerConstructor)
  }
}
