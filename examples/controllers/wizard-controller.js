import Controller from "./controller"
import { has } from "stimulus"

@has("stepElements", "resultsElement")

export default class WizardController extends Controller {
  initialize() {
    this.stepHistory = []
  }

  nextStep(event) {
    this.recordStepHistory(event)
    const {currentStepElement, nextStepElement} = this
    if (nextStepElement) {
      currentStepElement.classList.remove("current-step")
      nextStepElement.classList.add("current-step")
    }
  }

  // Private

  recordStepHistory(event) {
    const valueElement = this.currentStepElement.querySelector("[name]")
    this.stepHistory.push({
      step: this.currentStepIndex + 1,
      value: (valueElement ? valueElement.value : null),
      eventType: event.type,
      tagName: event.target.tagName
    })

    this.renderResults()
  }

  renderResults() {
    this.resultsElement.innerHTML = JSON.stringify(this.stepHistory, null, 2)
  }

  get currentStepElement() {
    return this.stepElements.find(element => element.classList.contains("current-step"))
  }

  get nextStepElement() {
    return this.stepElements[this.currentStepIndex + 1]
  }

  get currentStepIndex() {
    return this.stepElements.indexOf(this.currentStepElement)
  }
}
