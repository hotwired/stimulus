import Controller from "./controller"
import { Descriptor, Action } from "stimulus"

export default class extends Controller {
  initialize() {
    console.log("close-warning#initialize", this.identifier, this.element)

    this.addAction("beforeunload->warn", window)
    this.addAction("[submit]click->process")
  }

  warn(event) {
    if (this.hasUnsavedContent()) {
      event.returnValue = "Are you sure?"
      return event.returnValue
    }
  }

  process(event) {
    console.log("close-warning#process", event)
  }

  hasUnsavedContent() {
    return this.getInput().length > 0
  }

  getInput() {
    return this.targets.find("input").value
  }
}
