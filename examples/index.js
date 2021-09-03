import { Application, definitionsFromContext } from "@hotwired/stimulus"
import Turbolinks from "turbolinks"

Turbolinks.start()

const application = Application.start()
const context = require.context("./controllers", true, /\.js$/)
application.load(definitionsFromContext(context))
