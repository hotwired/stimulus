import { Controller } from "stimulus"

export default class extends Controller {
  enforceLimit(event) {
    if (this.exceedsLimit) {
      this.element.value = this.safeValue
    }
  }

  get exceedsLimit() {
    return this.length > this.limit
  }

  get limit() {
    return parseInt(this.data.get("limit"))
  }

  get length() {
    return this.value.length
  }

  get value() {
    return this.element.value
  }

  get safeValue() {
    return this.value.slice(0, this.limit)
  }
}
