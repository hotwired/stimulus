import { Controller } from "stimulus"

export default class ExpanderController extends Controller {
  toggle() {
    this.isExpanded ? this.collapse() : this.expand()
  }

  expand() {
    this.data.set("expanded", true)
  }

  collapse() {
    this.data.delete("expanded")
  }

  get isExpanded() {
    return this.data.has("expanded")
  }
}
