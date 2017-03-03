export interface ControllerConstructor {
  new(identifier: string, element: Element): Controller
}

export class Controller {
  identifier: string
  element: Element

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
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
