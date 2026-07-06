import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  showModal() {
    this.element.showModal()
  }
}
