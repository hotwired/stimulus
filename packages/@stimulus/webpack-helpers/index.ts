import { Definition } from "@stimulus/core"

// https://webpack.js.org/guides/dependency-management/#require-context
export interface Context {
  (key: string): Module
  keys(): Array<string>
  resolve(key: string): number
  id: number
}

export interface Module {
  __esModule: boolean
  default?: object
}

export function definitionsFromContext(context: Context): Definition[] {
  return context.keys()
    .map(key => definitionForModuleWithContextAndKey(context, key))
    .filter(value => value) as Definition[]
}

function definitionForModuleWithContextAndKey(context: Context, key: string): Definition | undefined {
  const identifier = identifierForContextKey(key)
  if (identifier) {
    return definitionForModuleAndIdentifier(context(key), identifier)
  }
}

function definitionForModuleAndIdentifier(module: Module, identifier: string): Definition | undefined {
  const controllerConstructor = module.default
  if (typeof controllerConstructor == "function") {
    return { identifier, controllerConstructor }
  }
}

function identifierForContextKey(key: string): string | undefined {
  const dasherizedKey = key.replace(/_/g, "-")
  const matches = dasherizedKey.match(/([\w-]+)-controller(\.\w+)?$/i)
  if (matches) {
    const identifier = matches[1].replace(/-controller$/i, "")
    if (identifier) {
      return identifier
    }
  }
}
