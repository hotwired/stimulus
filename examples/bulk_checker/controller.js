import { app } from "../app"

app.register("bulk-checker", class extends Stimulus.Controller {
  initialize() {
    console.log("bulk-checker#initialize", this.identifier, this.element)
  }

  checkAll(event) {
    for (const element of this.targets.findAll("checkbox")) {
      element.checked = true
    }
  }

  uncheckAll(event) {
    for (const element of this.targets.findAll("checkbox")) {
      element.checked = false
    }
  }
})
