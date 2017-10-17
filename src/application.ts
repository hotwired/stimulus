import { Configuration, ConfigurationOptions, createConfiguration } from "./configuration"
import { Controller, ControllerConstructor } from "./controller"
import { Logger } from "./logger"
import { Router } from "./router"

// https://webpack.js.org/guides/dependency-management/#require-context
export interface ContextModule {
  (key: string): Module
  keys(): Array<string>
  resolve(key: string): number
  id: number
}

export interface Module {
  __esModule: boolean
  default?: object
}

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

  unregister(identifier: string) {
    this.router.unregister(identifier)
  }

  registerContext(contextModule: ContextModule) {
    contextModule.keys().forEach(key => {
      const identifier = getIdentifierForContextKey(key)
      if (identifier) {
        const controllerConstructor = contextModule(key).default
        if (typeof controllerConstructor == "function") {
          this.register(identifier, controllerConstructor)
        }
      }
    })
  }

  getControllerForElementAndIdentifier(element: Element, identifier: string): Controller | null {
    const context = this.router.getContextForElementAndIdentifier(element, identifier)
    return context ? context.controller : null
  }
}

function getIdentifierForContextKey(key: string): string | undefined {
  const dasherizedKey = key.replace(/_/g, "-")
  const matches = dasherizedKey.match(/([\w-]+)-controller(\.\w+)?$/i)
  if (matches) {
    const identifier = matches[1].replace(/-controller$/i, "")
    if (identifier) {
      return identifier
    }
  }
}
