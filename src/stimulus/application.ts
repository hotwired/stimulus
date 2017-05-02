import { Configuration, ConfigurationOptions, createConfiguration } from "./configuration"
import { ControllerConstructor } from "./controller"
import { Logger } from "./logger"
import { Router } from "./router"

export class Application {
  configuration: Configuration
  logger: Logger
  private router: Router

  static start(configurationOptions?: ConfigurationOptions): Application {
    const application = new Application(configurationOptions)
    application.start()
    return application
  }

  constructor(configurationOptions: ConfigurationOptions = {}) {
    this.configuration = createConfiguration(configurationOptions)
    this.logger = new Logger(this.configuration.logLevel)
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
