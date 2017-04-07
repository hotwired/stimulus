import Controller from "./controller"

export default class extends Controller {
  expand(event) {
    this.allTargets.forEach(e => e.classList.add("expanded"))
  }

  collapse(event) {
    this.allTargets.forEach(e => e.classList.remove("expanded"))
  }

  toggle(event) {
    this.isExpanded ? this.collapse() : this.expand()
  }

  get isExpanded() {
    return this.element.classList.contains("expanded")
  }

  get allTargets() {
    const collapseTargets = this.targets.findAll("collapsed")
    const expandTargets = this.targets.findAll("expanded")
    return [this.element].concat(collapseTargets).concat(expandTargets)
  }
}
