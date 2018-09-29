import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "slide" ]
  static values = [
    { name: "index", type: "integer", default: 0 },
    { name: "currentSlideClass", default: "slide--current" }
  ]
  // static classes = [ "currentSlide" ]

  initialize() {
    this.render()
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

  indexChanged() {
    this.render()
  }

  render() {
    this.slideTargets.forEach((element, index) => {
      element.classList.toggle(this.currentSlideClass, index == this.index)
    })
  }

  get lastIndex() {
    return this.slideTargets.length - 1
  }
}
