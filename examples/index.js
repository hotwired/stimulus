import { Application, LogLevel } from "stimulus"
import Turbolinks from "turbolinks"

const application = new Application({ logLevel: LogLevel.DEBUG })
const requireContext = require.context("./controllers", true, /\.js$/)

for (const key of requireContext.keys()) {
  const matches = key.match(/\/(.+)-controller/)
  if (matches) {
    const identifier = matches[1]
    const controllerConstructor = requireContext(key).default
    application.register(identifier, controllerConstructor)
  }
}

application.start()
Turbolinks.start()
