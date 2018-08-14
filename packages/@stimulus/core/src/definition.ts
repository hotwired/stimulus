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
  type Constructor<T> = new(...args: any[]) => T

  function extendWithReflect<T extends Constructor<{}>>(constructor: T): T {
    function Controller() {
      return Reflect.construct(constructor, arguments, new.target)
    }

    Controller.prototype = Object.create(constructor.prototype, {
      constructor: { value: Controller }
    })

    Reflect.setPrototypeOf(Controller, constructor)
    return Controller as any
  }

  function testReflectExtension() {
    const a = function(this: any) { this.a.call(this) } as any
    const b = extendWithReflect(a)
    b.prototype.a = function() {}
    return new b
  }

  try {
    testReflectExtension()
    return extendWithReflect
  } catch (error) {
    return <T extends Constructor<{}>>(constructor: T) => class Controller extends constructor {}
  }
})()
