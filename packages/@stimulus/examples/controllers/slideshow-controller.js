import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.render()
  }

  navigateWithKeyboard(event) {
    if (event.keyCode == 37) {
      this.previous()
    } else if (event.keyCode == 39) {
      this.next()
    }
  }

  next() {
    this.index++
  }

  previous() {
    this.index--
  }

  render() {
    this.slideElements.forEach((element, index) => {
      element.classList.toggle("slide--current", index == this.index)
    })
  }

  get index() {
    return parseInt(this.data.get("index") || 0)
  }

  set index(value) {
    if (value < 0) {
      value = this.lastIndex
    } else if (value > this.lastIndex) {
      value = 0
    }
    this.data.set("index", value)
    this.render()
  }

  get lastIndex() {
    return this.length - 1
  }

  get length() {
    return this.slideElements.length
  }

  get slideElements() {
    return this.targets.findAll("slide")
  }
}
