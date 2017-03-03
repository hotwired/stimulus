App.register("bulk-checker", class extends stimulus.Controller {
  initialize() {
    console.log("bulk-checker#initialize", this.identifier, this.element)
  }

  connect() {
    console.log("bulk-checker#connect")
  }

  disconnect() {
    console.log("bulk-checker#disconnect")
  }
})