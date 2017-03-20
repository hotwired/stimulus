import Controller from "./controller"
import { Descriptor, Action } from "stimulus"

export default class extends Controller {
  initialize() {
    console.log("close-warning#initialize", this.identifier, this.element)

    this.addAction("beforeunload->warn", window)
    this.addAction("click->focusInput")
    this.addAction("input->autosave", "input")
    this.addAction("DOMFocusIn->clearWarning", "input")
    this.addAction("DOMFocusOut->addWarning", "input")
  }

  connect() {
    if (this.autosavedValue && this.autosavedValue != this.inputValue) {
      this.showAutosaveDialog()
    }
    this.focusInput()
  }

  // Action methods

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

  autosave() {
    this.autosavedValue = this.inputValue
  }

  restoreFromAutosave() {
    this.inputValue = this.autosavedValue
    this.discardAutosave()
  }

  discardAutosave() {
    localStorage.removeItem(this.autosaveKey)
    this.hideAutosaveDialog()
  }

  // Input

  get hasUnsavedContent() {
    return this.inputValue.length > 0
  }

  get inputValue() {
    return this.inputElement.value
  }

  set inputValue(value) {
    this.inputElement.value = value
  }

  get inputElement() {
    return this.targets.find("input")
  }

  // Autosave

  showAutosaveDialog() {
    this.autosaveElement.classList.remove("hidden")
  }

  hideAutosaveDialog() {
    this.autosaveElement.classList.add("hidden")
  }

  get autosaveElement() {
    return this.targets.find("autosave")
  }

  get autosaveKey() {
    return "close-warning:autosave"
  }

  get autosavedValue() {
    return localStorage.getItem(this.autosaveKey)
  }

  set autosavedValue(value) {
    localStorage.setItem(this.autosaveKey, value)
  }
}
