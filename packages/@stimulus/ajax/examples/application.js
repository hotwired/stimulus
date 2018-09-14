import { Application } from "@stimulus/core"
import ajax from "@stimulus/ajax"

const application = Application.start()
application.load(ajax)
