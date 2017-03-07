import { app } from "../app"

app.register("expander", class extends Stimulus.Controller {
  initialize() {
    console.log("expander#initialize", this.identifier, this.element)
  }

  expand(event) {
    this.element.classList.add("expanded")
  }

  collapse(event) {
    this.element.classList.remove("expanded")
  }

  toggle(event) {
    this.isExpanded ? this.collapse() : this.expand()
  }

  get isExpanded() {
    return this.element.classList.contains("expanded")
  }
})
