import Controller from "./controller"

export default class NavigationController extends Controller {
  connect() {
    const { pathname } = window.location
    const elements = this.targets.findAll("example")
    elements.forEach(element => {
      if (element.pathname == pathname) {
        element.classList.add("active")
      } else {
        element.classList.remove("active")
      }
    })
  }
}
