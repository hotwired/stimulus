import Controller from "./controller"
import { Descriptor, Action, on } from "stimulus"

export default class CloseWarningController extends Controller {
  connect() {
    if (this.autosavedValue && this.autosavedValue != this.inputValue) {
      this.showAutosaveDialog()
    }
    this.focusInput()
  }

  // Action methods

  @on("beforeunload", window)
  warnBeforeUnload(event) {
    if (this.hasUnsavedContent) {
      event.returnValue = "Are you sure?"
      return event.returnValue
    }
  }

  @on("~turbolinks:before-visit", document)
  warnBeforeVisit(event) {
    if (this.hasUnsavedContent) {
      if (!window.confirm("Are you sure?")) {
        event.preventDefault()
      }
    }
  }

  @on("click")
  focusInput(event) {
    this.inputElement.focus()
  }

  @on("DOMFocusOut", { targetName: "input" })
  addWarning(event) {
    if (this.hasUnsavedContent) {
      this.inputElement.classList.add("warning")
    }
  }

  @on("DOMFocusIn", { targetName: "input" })
  clearWarning(event) {
    this.inputElement.classList.remove("warning")
  }

  @on("input", { targetName: "input" })
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
