import Controller from "./controller"
import { installController } from "../app"

export default class extends Controller {
  initialize() {
    console.log("main#initialize", this.identifier, this.element)
  }

  get containerElement() {
    return this.targets.find("container")
  }

  load(event) {
    if (event.target == this.activeNavElement) {
      this.reattach()
    } else {
      this.setActiveNavElement(event.target)
      this.containerElement.innerHTML = ""
      installController(event.target.dataset.controllerIdentifier).then(() => {
        this.loadExampleForActiveNavElement()
      })
    }
  }

  reattach() {
    const {containerElement} = this
    const {firstChild} = containerElement
    containerElement.removeChild(firstChild)
    containerElement.appendChild(firstChild)
  }

  setActiveNavElement(element) {
    if (this.activeNavElement) {
      this.activeNavElement.classList.remove("active")
    }
    element.classList.add("active")
    this.activeNavElement = element
  }

  loadExampleForActiveNavElement() {
    fetch(`/views/${this.activeNavElement.dataset.controllerIdentifier}.html`)
      .then(response => response.text())
      .then(body => this.containerElement.innerHTML = `<div>${body}</div>`)
  }
}
