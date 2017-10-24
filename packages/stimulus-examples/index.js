import "stimulus-polyfills"
import { Application, LogLevel } from "stimulus"
import { autoload } from "stimulus-webpack"
import Turbolinks from "turbolinks"

const application = new Application({ logLevel: LogLevel.DEBUG })

const context = require.context("./controllers", true, /\.js$/)
autoload(context, application)

application.start()
Turbolinks.start()
