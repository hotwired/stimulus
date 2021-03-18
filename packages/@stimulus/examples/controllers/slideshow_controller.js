import { BikeshedController } from "stimulus"

export default class extends BikeshedController
  .target("slide")
  .class("currentSlide")
  .value("index", Number)
{
  next() {
    if (this.indexValue < this.lastIndex) {
      this.indexValue++
    }
  }

  previous() {
    if (this.indexValue > 0) {
      this.indexValue--
    }
  }

  indexValueChanged() {
    this.render()
  }

  render() {
    this.slideTargets.forEach((element, index) => {
      element.classList.toggle(this.currentSlideClass, index == this.indexValue)
    })
  }

  get lastIndex() {
    return this.slideTargets.length - 1
  }
}
