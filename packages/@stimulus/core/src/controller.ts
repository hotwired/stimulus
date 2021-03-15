import { BasicController } from "./basic_controller"
import { Constructor } from "./class"
import { BlessedClassProperties } from "./class_properties"
import { BlessedTargetProperties } from "./target_properties"
import { BlessedValueProperties } from "./value_properties"

export type ControllerConstructor = Constructor<BasicController>

export class Controller extends BasicController
  .uses(BlessedClassProperties)
  .uses(BlessedTargetProperties)
  .uses(BlessedValueProperties)
{}
