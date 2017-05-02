import { Application, LogLevel } from "stimulus"

let application
const controllerConstructors = new Map()

export function registerController(identifier, constructor) {
  if (!application) {
    application = Application.start({ logLevel: LogLevel.DEBUG })
  }

  if (!controllerConstructors.has(identifier)) {
    controllerConstructors.set(identifier, constructor)
    application.register(identifier, constructor)
  }
}

export function installController(identifier) {
  return import(`./controllers/${identifier}-controller`).then((module) => {
    registerController(identifier, module.default)
  })
}
