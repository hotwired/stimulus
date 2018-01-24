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
      function BlessedController() {
        return Reflect.construct(constructor, arguments, new.target)
      }

      BlessedController.prototype = Object.create(constructor.prototype, {
        constructor: { value: BlessedController }
      })

      Reflect.setPrototypeOf(BlessedController, constructor)
      return BlessedController as any
    }
  } else {
    return (constructor) => class BlessedController extends constructor {}
  }
})()
