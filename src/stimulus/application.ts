import { Router } from "sentinella"

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
    this.router.start()
  }

  stop() {
    this.router.stop()
  }

  register(identifier: string, controllerConstructor) {
    this.router.register(identifier, controllerConstructor)
  }
}