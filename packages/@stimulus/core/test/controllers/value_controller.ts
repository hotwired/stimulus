import { Controller } from "../../src/controller"
import { ValueDefinitionMap } from "../../src/value_properties"

class BaseValueController extends Controller {
  static values: ValueDefinitionMap = {
    shadowedBoolean: String,
    string: String,
    numeric: Number
  }

  stringValue!: string
  numericValue!: number
}

export class ValueController extends BaseValueController {
  static values: ValueDefinitionMap = {
    shadowedBoolean: Boolean,
    stringWithDefault: [String, "hello"],
    stringWithoutDefault: [String, undefined],
    json: JSON
  }

  shadowedBooleanValue!: boolean
  stringWithDefaultValue!: string
  stringWithoutDefaultValue!: string
  dateValue!: Date
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
