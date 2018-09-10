import { Application } from "@stimulus/core"
import { controllers } from "@stimulus/ajax"

const application = Application.start()
application.load(controllers)
