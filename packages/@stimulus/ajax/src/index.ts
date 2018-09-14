import { Definition } from "@stimulus/core"
import { ResourceController } from "./controller"

export default [
  { identifier: "resource", controllerConstructor: ResourceController }
] as Definition[]
