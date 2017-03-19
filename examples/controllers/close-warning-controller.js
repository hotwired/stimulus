import Controller from "./controller"
import { Descriptor, Action } from "stimulus"

export default class extends Controller {
  initialize() {
    console.log("close-warning#initialize", this.identifier, this.element)

    const descriptor = new Descriptor(null, "beforeunload", "warn", true)
    const warnAction = new Action(this, descriptor, window, null)
    this.addAction(warnAction)
  }

  warn(event) {
    if (this.hasUnsavedContent()) {
      event.returnValue = "Are you sure?"
      return event.returnValue
    }
  }

  hasUnsavedContent() {
    return this.getInput().length > 0
  }

  getInput() {
    return this.targets.find("input").value
  }
}
