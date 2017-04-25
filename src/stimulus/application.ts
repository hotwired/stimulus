import { Configuration, ConfigurationOptions, createConfiguration } from "./configuration"
import { ControllerConstructor } from "./controller"
import { Router } from "./router"
import { Logger } from "./logger"

const logger = Logger.create("application")

export class Application {
  configuration: Configuration
  private router: Router

  static start(configurationOptions: ConfigurationOptions): Application {
    const application = new Application(configurationOptions)
    application.start()
    return application
  }

  constructor(configurationOptions: ConfigurationOptions = {}) {
    this.configuration = createConfiguration(configurationOptions)
    this.router = new Router(this.configuration)
  }

  start() {
    logger.log("start")
    this.router.start()
  }

  stop() {
    logger.log("stop")
    this.router.stop()
  }

  register(identifier: string, controllerConstructor: ControllerConstructor) {
    logger.log("register", { identifier })
    this.router.register(identifier, controllerConstructor)
  }
}
