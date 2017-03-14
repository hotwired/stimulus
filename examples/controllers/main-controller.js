import Controller from "./controller"
import { installController } from "../app"

export default class extends Controller {
  initialize() {
    console.log("main#initialize", this.identifier, this.element)
  }

  load(event) {
    if (event.target == this.currentNavElement) {
      this.reattachContainerElement()
    } else {
      this.currentNavElement = event.target
      this.loadExampleForCurrentNavElement()
    }
  }

  reattachContainerElement() {
    const {containerElement} = this
    const {firstChild} = containerElement
    containerElement.removeChild(firstChild)
    containerElement.appendChild(firstChild)
  }

  loadExampleForCurrentNavElement() {
    const identifier = this.currentControllerIdentifier
    this.containerHTML = ""
    installController(identifier).then(() => {
      this.fetchView(identifier).then((body) => {
        this.containerHTML = `<div>${body}</div>`
      })
    })
  }

  fetchView(name) {
    return fetch(`/views/${name}.html`).then(response => response.text())
  }

  get containerElement() {
    return this.targets.find("container")
  }

  set containerHTML(html) {
    this.containerElement.innerHTML = html
  }

  set currentNavElement(element) {
    if (this.currentNavElement) {
      this.currentNavElement.classList.remove("active")
    }
    element.classList.add("active")
    this._currentNavElement = element
    return this.currentNavElement
  }

  get currentNavElement() {
    return this._currentNavElement
  }

  get currentControllerIdentifier() {
    return this.currentNavElement.dataset.controllerIdentifier
  }
}
