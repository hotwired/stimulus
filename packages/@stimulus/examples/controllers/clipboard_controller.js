import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "source" ]
  static classes = [ "supported" ]

  initialize() {
    if (document.queryCommandSupported("copy")) {
      this.element.classList.add(this.supportedClass)
    }
  }

  copy() {
    this.sourceTarget.select()
    document.execCommand("copy")
  }
}
