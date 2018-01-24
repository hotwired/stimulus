import { ControllerConstructor } from "./controller"

export interface Definition {
  identifier: string
  controllerConstructor: ControllerConstructor
}

export function blessDefinition(definition: Definition): Definition {
  return {
    identifier: definition.identifier,
    controllerConstructor: blessControllerConstructor(definition.controllerConstructor)
  }
}

function blessControllerConstructor(controllerConstructor: ControllerConstructor): ControllerConstructor {
  const constructor = extend(controllerConstructor)
  constructor.bless()
  return constructor
}

const extend = (() => {
  if (typeof Reflect == "object" && typeof Reflect.construct == "function") {
    return (constructor) => {
      function Controller() {
        return Reflect.construct(constructor, arguments, new.target)
      }

      Controller.prototype = Object.create(constructor.prototype, {
        constructor: { value: Controller }
      })

      Reflect.setPrototypeOf(Controller, constructor)
      return Controller as any
    }
  } else {
    return (constructor) => class Controller extends constructor {}
  }
})()
