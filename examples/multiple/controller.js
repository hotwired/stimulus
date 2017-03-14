import Controller from "../controller"

Controller.register("multiple", class extends Controller {
  initialize() {
    console.log("multiple#initialize", this.identifier, this.element)
    this.element.style.opacity = "0.2"

    Controller.import(...this.controllerNames).then(() => {
      this.element.style.opacity = null
    })
  }

  get controllerNames() {
    const names = new Set()
    Array.from(this.element.querySelectorAll("[data-controller]")).forEach((element) => {
      names.add(element.dataset.controller)
    })
    return Array.from(names)
  }
})


