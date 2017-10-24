import { Application } from "stimulus"

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

export function autoload(contextModule: ContextModule, application: Application) {
  contextModule.keys().forEach(key => {
    const identifier = getIdentifierForContextKey(key)
    if (identifier) {
      const controllerConstructor = contextModule(key).default
      if (typeof controllerConstructor == "function") {
        application.register(identifier, controllerConstructor)
      }
    }
  })
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
