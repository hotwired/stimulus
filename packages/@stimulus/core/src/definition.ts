import { ControllerConstructor } from "./controller"

export interface Definition {
  identifier: string
  controllerConstructor: ControllerConstructor
}

export function importDefinition({ identifier, controllerConstructor }: Definition): Definition {
  return { identifier, controllerConstructor: class extends controllerConstructor {} }
}
