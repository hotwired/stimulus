import { Selector } from "./selector"

export interface ControllerConstructor {
  new(element: Element): Controller
  prototype: Controller
}

export interface Controller {
  connect()
  disconnect()
}

export class DefaultController implements Controller {
  element: Element

  constructor(element: Element) {
    this.element = element
  }

  connect() {}
  disconnect() {}
}

export function controllerConstructorForPrototype(prototype): ControllerConstructor {
  const constructor = function(element: Element) {
    DefaultController.call(this, element)
  }
  constructor.prototype = Object.create(prototype)

  const descriptor = { enumerable: false, writable: true, value: constructor }
  Object.defineProperty(constructor.prototype, "constructor", descriptor)

  return <ControllerConstructor> <Function> constructor
}
