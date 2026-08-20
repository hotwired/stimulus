import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["element"]

  elementOutletConnected(controller, element) {
    this.element.setAttribute("aria-controls", element.id)
    this.element.setAttribute("aria-expanded", element.open)
  }

  elementOutletDisconnected() {
    this.element.removeAttribute("aria-controls")
    this.element.removeAttribute("aria-expanded")
  }

  expand() {
    for (const elementOutlet of this.elementOutlets) {
      elementOutlet.showModal()
      this.element.setAttribute("aria-expanded", elementOutlet.element.open)
    }
  }

  collapse() {
    this.element.setAttribute("aria-expanded", false)
    this.element.focus()
  }
}
