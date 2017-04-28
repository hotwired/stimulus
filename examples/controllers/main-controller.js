import Controller from "./controller"
import { installController } from "../app"

export default class MainController extends Controller {
  connect() {
    if (this.example) {
      this.loadExample()
    }
  }

  load(event) {
    this.example = event.target.dataset.example
    this.loadExample()
  }

  // Private

  loadExample() {
    this.updateNav()

    this.containerHTML = ""
    this.installController().then(() => {
      this.fetchView().then((body) => {
        this.containerHTML = `<div>${body}</div>`
      })
    })
  }

  installController() {
    return installController(this.example)
  }

  fetchView() {
    return fetch(`/views/${this.example}.html`).then(response => response.text())
  }

  updateNav() {
    const { example } = this
    this.navElements.forEach(element => {
      if (element.dataset.example == example) {
        element.classList.add("active")
      } else {
        element.classList.remove("active")
      }
    })
  }

  get navElements() {
    return this.targets.findAll("nav")
  }

  get containerElement() {
    return this.targets.find("container")
  }

  set containerHTML(html) {
    this.containerElement.innerHTML = html
  }

  set example(identifier) {
    this.data.set("example", identifier)
  }

  get example() {
    return this.data.get("example")
  }
}
