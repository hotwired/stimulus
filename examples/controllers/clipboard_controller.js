import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "source" ]
  static classes = [ "supported" ]

  initialize() {
    if (document.queryCommandSupported("copy")) {
      this.element.classList.add(this.supportedClass)
    }
  }

  copy() {
    navigator.clipboard.writeText(this.sourceTarget.value)
  }
}
