app.register("expander", class extends Stimulus.Controller {
  initialize() {
    console.log("expander#initialize", this.identifier, this.element)
  }

  expand(event) {
    this.targets.find("collapsed").classList.add("hidden")
    this.targets.find("expanded").classList.remove("hidden")
  }

  collapse(event) {
    this.targets.find("collapsed").classList.remove("hidden")
    this.targets.find("expanded").classList.add("hidden")
  }

  toggle(event) {
    this.isExpanded ? this.collapse() : this.expand()
  }

  get isExpanded() {
    return this.targets.find("collapsed").classList.contains("hidden")
  }
})
