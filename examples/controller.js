import { app } from "./app"
import { Controller } from "../src/stimulus"

app.register("example", class extends Controller {
  initialize() {
    console.log("example#initialize", this.identifier, this.element)
  }

  get containerElement() {
    return this.targets.find("container")
  }

  load(event) {
    if (event.target == this.activeNavElement) {
      this.reattach()
    } else {
      this.setActiveNavElement(event.target)
      this.loadExampleForActiveNavElement()
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
    fetch(this.activeNavElement.href)
      .then(response => response.text())
      .then(body => this.containerElement.innerHTML = `<div>${body}</div>`)
  }
})
