import { Application, Controller } from "stimulus"

let application

export default class extends Controller {
  static register(...args) {
    if (!application) {
      application = Application.start()
    }
    return application.register(...args)
  }

  static import(...names) {
    names = names.map(name => name.replace(/^\//, ""))
    return Promise.all(names.map(name => import("./" + name + "/controller")))
  }
}
