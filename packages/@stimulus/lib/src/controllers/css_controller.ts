import { Controller } from "@stimulus/core"

export default class extends Controller {
  get viewTarget() {
    return this.targets.find("view") || this.element
  }

  addClass() {
    requestAnimationFrame(() => this.classList.add(this.className))
  }

  removeClass() {
    requestAnimationFrame(() => this.classList.remove(this.className))
  }

  toggleClass() {
    requestAnimationFrame(() => this.classList.toggle(this.className))
  }

  get classList() {
    return this.viewTarget.classList
  }

  get className() {
    const className = this.data.get("class")
    if (!className) {
      throw new Error(`Missing "data-${this.identifier}-class" attribute`)
    }
    return className
  }
}
