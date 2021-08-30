import { Controller } from "../../core/controller"
import { ValueDefinitionMap, ValueDescriptorMap } from "../../core/value_properties"

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
  oldLoggedNumericValues: any[] = []
  numericValueChanged(value: number, oldValue: any) {
    this.loggedNumericValues.push(value)
    this.oldLoggedNumericValues.push(oldValue)
  }

  loggedMissingStringValues: string[] = []
  oldLoggedMissingStringValues: any[] = []
  missingStringValueChanged(value: string, oldValue: any) {
    this.loggedMissingStringValues.push(value)
    this.oldLoggedMissingStringValues.push(oldValue)
  }

  optionsValues: Object[] = []
  oldOptionsValues: any[] = []
  optionsValueChanged(value: Object, oldValue: any) {
    this.optionsValues.push(value)
    this.oldOptionsValues.push(oldValue)
  }
}
