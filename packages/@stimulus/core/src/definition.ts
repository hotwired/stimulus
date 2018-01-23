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
  const constructor = class extends controllerConstructor { }
  constructor.bless()
  return constructor
}
