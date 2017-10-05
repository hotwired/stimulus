import Controller from "./controller"
import { has } from "stimulus"

@has("collapsedElements", "expandedElements")

export default class ExpanderController extends Controller {
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
    return [this.element].concat(this.collapsedElements, this.expandedElements)
  }
}
