import { Selector } from "./selector"

export interface ControllerConstructor {
  new(selector: Selector, element: Element): Controller
  prototype: Controller
}

export interface Controller {
  matched()
  unmatched()
}
