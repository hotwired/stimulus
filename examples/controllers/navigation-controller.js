import Controller from "./controller"

export default class NavigationController extends Controller {
  connect() {
    const { pathname } = window.location
    const elements = this.targets.findAll("example")
    elements.forEach(element => {
      element.classList.toggle("active", element.pathname == pathname)
    })
  }
}
