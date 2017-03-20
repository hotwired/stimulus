import Controller from "./controller"
import { Descriptor, Action } from "stimulus"

export default class extends Controller {
  initialize() {
    console.log("close-warning#initialize", this.identifier, this.element)

    this.addAction("beforeunload->warn", window)
    this.addAction("click->focusInput")
    this.addAction("DOMFocusIn->clearWarning", "input")
    this.addAction("DOMFocusOut->addWarning", "input")
  }

  warn(event) {
    if (this.hasUnsavedContent) {
      event.returnValue = "Are you sure?"
      return event.returnValue
    }
  }

  focusInput(event) {
    console.log("close-warning#focusInput", event)
    this.inputElement.focus()
  }

  addWarning(event) {
    console.log("close-warning#addWarning", event)
    if (this.hasUnsavedContent) {
      this.inputElement.classList.add("warning")
    }
  }

  clearWarning(event) {
    console.log("close-warning#clearWarning", event)
    this.inputElement.classList.remove("warning")
  }

  get hasUnsavedContent() {
    return this.inputValue.length > 0
  }

  get inputValue() {
    return this.inputElement.value
  }

  get inputElement() {
    return this.targets.find("input")
  }
}
