import { ClassPropertiesMacro } from "./class_properties"
import { BasicController } from "./basic_controller"
import { TargetPropertiesMacro } from "./target_properties"
import { ValuePropertiesMacro } from "./value_properties"

export class BikeshedController extends BasicController
  .uses(ClassPropertiesMacro)
  .uses(TargetPropertiesMacro)
  .uses(ValuePropertiesMacro)
{}
