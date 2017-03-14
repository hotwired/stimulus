import { Application } from "stimulus"
const app = Application.start()

export { app }

export function importController(...names) {
  return Promise.all(names.map(name => import("./" + name + "/controller")))
}
