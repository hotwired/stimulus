app.register("expander", class extends Stimulus.Controller {
  initialize() {
    console.log("expander#initialize", this.identifier, this.element)
  }

  expand(event) {
    console.log("expand", event)
  }

  collapse(event) {
    console.log("collapse", event)
  }

  toggle(event) {
    console.log("toggle", event)
  }
})