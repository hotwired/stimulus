import "polyfills"
import { Application, LogLevel } from "stimulus"
import Turbolinks from "turbolinks"

const application = new Application({ logLevel: LogLevel.DEBUG })

const context = require.context("./controllers", true, /\.js$/)
application.registerContext(context)

application.start()
Turbolinks.start()
