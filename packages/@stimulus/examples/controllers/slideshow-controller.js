import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.showSlideAtIndex(this.currentIndex)
  }

  navigate(event) {
    if (event.keyCode == 37) {
      this.previous()
    } else if (event.keyCode == 39) {
      this.next()
    }
  }

  next() {
    this.showSlideAtIndex(this.nextIndex)
  }

  previous() {
    this.showSlideAtIndex(this.previousIndex)
  }

  showSlideAtIndex(index) {
    this.currentSlideElement.classList.remove("slide--current")
    this.data.set("index", index)
    this.currentSlideElement.classList.add("slide--current")
  }

  get currentIndex() {
    if (this.data.has("index")) {
      return Number(this.data.get("index"))
    } else {
      return 0
    }
  }

  get nextIndex() {
    const index = this.currentIndex + 1
    return this.slideElements[index] ? index : 0
  }

  get previousIndex() {
    const index = this.currentIndex - 1
    return this.slideElements[index] ? index : this.slideElements.length - 1
  }

  get currentSlideElement() {
    return this.slideElements[this.currentIndex]
  }

  get slideElements() {
    return this.targets.findAll("slide")
  }
}
