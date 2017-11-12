import { Controller } from "stimulus"

export default class BulkCheckerController extends Controller {
  checkAll(event) {
    this.targets.findAll("checkbox").forEach(element => {
      element.checked = true
    })
  }

  uncheckAll(event) {
    this.targets.findAll("checkbox").forEach(element => {
      element.checked = false
    })
  }
}
