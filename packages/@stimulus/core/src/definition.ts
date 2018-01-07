import { ControllerConstructor } from "./controller"

export interface Definition {
  identifier: string
  controllerConstructor: ControllerConstructor
}
