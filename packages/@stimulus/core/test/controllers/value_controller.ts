import { Controller } from "../../src/controller"
import { ValueDefinition } from "../../src/value_properties"

class BaseValueController extends Controller {
  static values: ValueDefinition[] = [
    "shadowedBoolean",
    "string",
    { name: "explicitString", type: "string" },
    { name: "numeric", type: "number" }
  ]

  stringValue!: string
  explicitStringValue!: string
  numericValue!: number
}

export class ValueController extends BaseValueController {
  static values: ValueDefinition[] = [
    { name: "shadowedBoolean", type: "boolean" },
    { name: "stringWithDefault", defaultValue: "hello" },
    { name: "json", type: "json" }
  ]

  shadowedBooleanValue!: boolean
  stringWithDefaultValue!: string
  jsonValue!: any

  loggedNumericValues: number[] = []
  numericValueChanged(value: number) {
    this.loggedNumericValues.push(value)
  }

  loggedStringWithDefaultValues: string[] = []
  stringWithDefaultValueChanged(value: string) {
    this.loggedStringWithDefaultValues.push(value)
  }
}
