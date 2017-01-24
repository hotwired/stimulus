export interface ControllerConstructor {
  new(element: Element): Controller
}

export class Controller {
  element: Element

  constructor(element: Element) {
    this.element = element
    this.initialize()
  }

  initialize() {
  }

  connect() {
  }

  disconnect() {
  }
}
