import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "slide" ]

  initialize() {
    this.showCurrentSlide()
  }

  next() {
    if (this.index < this.lastIndex) {
      this.index++
    }
  }

  previous() {
    if (this.index > 0) {
      this.index--
    }
  }

  showCurrentSlide() {
    this.slideTargets.forEach((element, index) => {
      element.classList.toggle("slide--current", index == this.index)
    })
  }

  get index() {
    if (this.data.has("index")) {
      return parseInt(this.data.get("index"))
    } else {
      return 0
    }
  }

  set index(value) {
    this.data.set("index", value)
    this.showCurrentSlide()
  }

  get lastIndex() {
    return this.slideTargets.length - 1
  }
}
