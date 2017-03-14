import Controller from "../controller"

Controller.register("wizard", class extends Controller {
  initialize() {
    this.stepHistory = []
  }

  nextStep(event) {
    this.recordStepHistory(event)
    const {currentStepElement, nextStepElement} = this
    if (nextStepElement) {
      delete currentStepElement.dataset.currentStep
      nextStepElement.dataset.currentStep = true
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
    return this.stepElements.find(e => e.dataset.currentStep)
  }

  get nextStepElement() {
    return this.stepElements[this.currentStepIndex + 1]
  }

  get currentStepIndex() {
    return this.stepElements.indexOf(this.currentStepElement)
  }
})
