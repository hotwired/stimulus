import { Definition } from "@stimulus/core"

export interface ECMAScriptModule {
  __esModule: boolean
  default?: object
}

export function definitionsFromContext(context: __WebpackModuleApi.RequireContext): Definition[] {
  return context.keys()
    .map(key => definitionForModuleWithContextAndKey(context, key))
    .filter(value => value) as Definition[]
}

function definitionForModuleWithContextAndKey(context: __WebpackModuleApi.RequireContext, key: string): Definition | undefined {
  const identifier = identifierForContextKey(key)
  if (identifier) {
    return definitionForModuleAndIdentifier(context(key), identifier)
  }
}

function definitionForModuleAndIdentifier(module: ECMAScriptModule, identifier: string): Definition | undefined {
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
