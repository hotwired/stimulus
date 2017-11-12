import { Controller } from "stimulus"

export default class WizardController extends Controller {
  initialize() {
    this.stepHistory = []
  }

  nextStep(event) {
    event.preventDefault()
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
    this.targets.find("results").innerHTML = JSON.stringify(this.stepHistory, null, 2)
  }

  get stepElements() {
    return this.targets.findAll("step")
  }

  get currentStepElement() {
    let element
    this.stepElements.some(stepElement => {
      if (stepElement.classList.contains("current-step")) {
        return element = stepElement
      }
    })
    return element
  }

  get nextStepElement() {
    return this.stepElements[this.currentStepIndex + 1]
  }

  get currentStepIndex() {
    return this.stepElements.indexOf(this.currentStepElement)
  }
}
