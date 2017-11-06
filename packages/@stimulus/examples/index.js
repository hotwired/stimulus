import "@stimulus/polyfills"
import { Application } from "stimulus"
import { autoload } from "stimulus/webpack-helpers"
import Turbolinks from "turbolinks"

const application = Application.start()
autoload(require.context("./controllers", true, /\.js$/), application)

Turbolinks.start()
