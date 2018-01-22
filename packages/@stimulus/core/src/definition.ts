import { ControllerConstructor } from "./controller"

export interface Definition {
  identifier: string
  controllerConstructor: ControllerConstructor
}

export function importDefinition(definition: Definition): Definition {
  return {
    identifier: definition.identifier,
    controllerConstructor: importControllerConstructor(definition.controllerConstructor)
  }
}

function importControllerConstructor(controllerConstructor: ControllerConstructor): ControllerConstructor {
  const constructor = class extends controllerConstructor { }
  constructor.import()
  return constructor
}
