import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "source" ]

  initialize() {
    if (document.queryCommandSupported("copy")) {
      this.element.classList.add("clipboard--supported")
    }
  }

  copy() {
    this.sourceTarget.select()
    document.execCommand("copy")
  }
}
