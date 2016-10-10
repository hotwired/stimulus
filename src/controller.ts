declare class Context {}

export interface ControllerConstructor {
  new(context: Context): Controller
  prototype: Controller
}

export interface Controller {
  context: Context

  initialize()
  connect()
  disconnect()
}

export function DefaultController(context: Context) {
  this.context = context
  this.initialize()
  return this
}

DefaultController.prototype = {
  initialize() {},
  connect() {},
  disconnect() {},

  get element(): Element {
    return this.context.element
  },

  get parentController(): Controller | undefined {
    return this.context.parentController
  }
}

export function controllerConstructorForPrototype(prototype): ControllerConstructor {
  function Controller(context: Context) {
    return DefaultController.call(this, context)
  }

  const extendedPrototype = Object.create(DefaultController.prototype)
  Controller.prototype = extend(extendedPrototype, prototype)

  return <ControllerConstructor> <Function> Controller
}

function extend(target, source) {
  for (const key in source) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key)
    Object.defineProperty(target, key, descriptor)
  }

  return target
}