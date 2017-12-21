import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    if (document.queryCommandSupported("copy")) {
      this.element.classList.add("clipboard--supported")
    }
  }

  copy() {
    this.sourceElement.select()
    document.execCommand("copy")
  }

  get sourceElement() {
    return this.targets.find("source")
  }
}
