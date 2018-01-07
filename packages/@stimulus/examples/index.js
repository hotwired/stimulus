import "@stimulus/polyfills"
import { Application } from "stimulus"
import { definitionsFromWebpackContext } from "stimulus/webpack-helpers"
import Turbolinks from "turbolinks"

Turbolinks.start()

const application = Application.start()
const definitions = definitionsFromWebpackContext(require.context("./controllers", true, /\.js$/))
application.load(definitions)
