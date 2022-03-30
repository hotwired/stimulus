import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "tab", "tabpanel" ]
  static classes = [ "current" ]
  static values = { index: { default: 0, type: Number } }

  next() {
    if (this.indexValue < this.lastIndex) {
      this.indexValue++
      return
    }
    this.indexValue = 0
  }

  previous() {
    if (this.indexValue > 0) {
      this.indexValue--
      return
    }
    this.indexValue = this.lastIndex
  }

  open(evt) {
    this.indexValue = this.tabTargets.indexOf(evt.currentTarget)
  }

  get lastIndex() {
    return this.tabTargets.length - 1
  }

  indexValueChanged(current, old) {
    let panels = this.tabpanelTargets
    let tabs = this.tabTargets

    if (old != null) {
      panels[old].classList.remove(...this.currentClasses)
      tabs[old].tabIndex = -1
    }
    panels[current].classList.add(...this.currentClasses)
    tabs[current].tabIndex = 0
    tabs[current].focus()
  }
}
