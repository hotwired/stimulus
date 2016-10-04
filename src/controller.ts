import { Selector } from "./selector"

export interface ControllerConstructor {
  new(element: Element): Controller
  prototype: Controller
}

export interface Controller {
  connect()
  disconnect()
}

export function DefaultController(element: Element) {
  this.element = element
  this.initialize()
}

DefaultController.prototype = {
  initialize: function() {},
  connect: function() {},
  disconnect: function() {}
}

export function controllerConstructorForPrototype(prototype): ControllerConstructor {
  const constructor = function(element: Element) {
    DefaultController.call(this, element)
  }
  constructor.prototype = Object.create(DefaultController.prototype)

  for (const key in prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key)
    Object.defineProperty(constructor.prototype, key, descriptor)
  }

  const descriptor = { enumerable: false, writable: true, value: constructor }
  Object.defineProperty(constructor.prototype, "constructor", descriptor)

  return <ControllerConstructor> <Function> constructor
}
