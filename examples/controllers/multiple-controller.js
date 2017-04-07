import Controller from "./controller"
import { installController } from "../app"

export default class extends Controller {
  initialize() {
    this.element.style.opacity = "0.2"

    Promise.all([this.controllerIdentifiers.map(installController)]).then(() => {
      this.element.style.opacity = null
    })
  }

  get controllerIdentifiers() {
    const names = new Set()
    Array.from(this.element.querySelectorAll("[data-controller]")).forEach((element) => {
      names.add(element.dataset.controller)
    })
    return Array.from(names)
  }
}


