import Controller from "./controller"
import { has } from "stimulus"

@has("exampleElements")

export default class NavigationController extends Controller {
  connect() {
    const { pathname } = window.location
    this.exampleElements.forEach(element => {
      if (element.pathname == pathname) {
        element.classList.add("active")
      } else {
        element.classList.remove("active")
      }
    })
  }
}
