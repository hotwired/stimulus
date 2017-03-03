app.register("bulk-checker", class extends Stimulus.Controller {
  initialize() {
    console.log("bulk-checker#initialize", this.identifier, this.element)
  }

  checkAll(event) {
    console.log("checkAll", event)
  }

  uncheckAll(event) {
    console.log("uncheckAll", event)
  }
})