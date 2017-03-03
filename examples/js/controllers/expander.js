app.register("expander", class extends Stimulus.Controller {
  initialize() {
    console.log("expander#initialize", this.identifier, this.element)
  }

  connect() {
    console.log("expander#connect")
  }

  disconnect() {
    console.log("expander#disconnect")
  }
})