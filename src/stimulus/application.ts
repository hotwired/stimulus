import { ControllerConstructor } from "./controller"
import { Router } from "./router"
import { Logger } from "./logger"

const logger = Logger.create("application")

export class Application {
  private router: Router

  static start(): Application {
    const router = new Router(document.documentElement, "data-controller")
    const application = new Application(router)
    application.start()
    return application
  }

  constructor(router: Router) {
    this.router = router
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
