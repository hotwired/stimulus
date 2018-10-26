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
    missingString: String,
    ids: Array,
    options: Object
  }

  shadowedBooleanValue!: boolean
  missingStringValue!: string
  idsValue!: any[]
  optionsValue!: { [key: string]: any }

  loggedNumericValues: number[] = []
  numericValueChanged(value: number) {
    this.loggedNumericValues.push(value)
  }

  loggedMissingStringValues: string[] = []
  missingStringValueChanged(value: string) {
    this.loggedMissingStringValues.push(value)
  }
}
