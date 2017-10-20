import Controller from "./controller"
import { has } from "stimulus"

@has("checkboxElements")

export default class BulkCheckerController extends Controller {
  checkAll(event) {
    this.checkboxElements.forEach(element => element.checked = true)
  }

  uncheckAll(event) {
    this.checkboxElements.forEach(element => element.checked = false)
  }
}
