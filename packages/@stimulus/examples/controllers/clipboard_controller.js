import { BikeshedController } from "stimulus"

export default class extends BikeshedController
  .target("source")
  .class("supported")
{
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
