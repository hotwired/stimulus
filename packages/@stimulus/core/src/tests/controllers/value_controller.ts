import { Controller } from "../../controller"
import { ValueDefinitionMap, ValueDescriptorMap } from "../../value_properties"

class BaseValueController extends Controller {
  static values: ValueDefinitionMap = {
    shadowedBoolean: String,
    string: String,
    numeric: Number
  }

  valueDescriptorMap!: ValueDescriptorMap
  stringValue!: string
  numericValue!: number
}

export class ValueController extends BaseValueController {
  static values: ValueDefinitionMap = {
    shadowedBoolean: Boolean,
    missingString: String,
    ids: Array,
    options: Object,
    "time-24hr": Boolean
  }

  shadowedBooleanValue!: boolean
  missingStringValue!: string
  idsValue!: any[]
  optionsValue!: { [key: string]: any }
  time24hrValue!: Boolean

  loggedNumericValues: number[] = []
  numericValueChanged(value: number) {
    this.loggedNumericValues.push(value)
  }

  loggedMissingStringValues: string[] = []
  missingStringValueChanged(value: string) {
    this.loggedMissingStringValues.push(value)
  }
}
