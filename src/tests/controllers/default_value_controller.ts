import { Controller } from "../../core/controller"
import { ValueDefinitionMap, ValueDescriptorMap } from "../../core/value_properties"

export class DefaultValueController extends Controller {
  static values: ValueDefinitionMap = {
    defaultBoolean: false,
    defaultBooleanTrue: { type: Boolean, default: true },
    defaultBooleanFalse: { type: Boolean, default: false },
    defaultBooleanOverride: true,
    defaultBooleanWithTypeConstant: Boolean,
    defaultBooleanWithTypeProperty: { type: Boolean },

    defaultString: "",
    defaultStringHello: { type: String, default: "Hello" },
    defaultStringOverride: "Override me",
    defaultStringWithTypeConstant: String,
    defaultStringWithTypeProperty: { type: String },

    defaultNumber: 0,
    defaultNumberThousand: { type: Number, default: 1000 },
    defaultNumberZero: { type: Number, default: 0 },
    defaultNumberOverride: 9999,
    defaultNumberWithTypeConstant: Number,
    defaultNumberWithTypeProperty: { type: Number },

    defaultArray: [],
    defaultArrayFilled: { type: Array, default: [1, 2, 3] },
    defaultArrayOverride: [9, 9, 9],
    defaultArrayWithTypeConstant: Array,
    defaultArrayWithTypeProperty: { type: Array },

    defaultObject: {},
    defaultObjectPerson: { type: Object, default: { name: "David" } },
    defaultObjectOverride: { override: "me" },
    defaultObjectWithTypeConstant: Object,
    defaultObjectWithTypeProperty: { type: Object },
  }

  valueDescriptorMap!: ValueDescriptorMap

  defaultBooleanValue!: boolean
  hasDefaultBooleanValue!: boolean
  defaultBooleanTrueValue!: boolean
  defaultBooleanFalseValue!: boolean
  hasDefaultBooleanTrueValue!: boolean
  hasDefaultBooleanFalseValue!: boolean
  defaultBooleanOverrideValue!: boolean
  hasDefaultBooleanOverrideValue!: boolean
  defaultBooleanWithTypeConstantValue!: boolean
  hasDefaultBooleanWithTypeConstantValue!: boolean
  defaultBooleanWithTypePropertyValue!: boolean
  hasDefaultBooleanWithTypePropertyValue!: boolean

  defaultStringValue!: string
  hasDefaultStringValue!: boolean
  defaultStringHelloValue!: string
  hasDefaultStringHelloValue!: boolean
  defaultStringOverrideValue!: string
  hasDefaultStringOverrideValue!: boolean
  defaultStringWithTypeConstantValue!: string
  hasDefaultStringWithTypeConstantValue!: boolean
  defaultStringWithTypePropertyValue!: string
  hasDefaultStringWithTypePropertyValue!: boolean

  defaultNumberValue!: number
  hasDefaultNumberValue!: boolean
  defaultNumberThousandValue!: number
  hasDefaultNumberThousandValue!: boolean
  defaultNumberZeroValue!: number
  hasDefaultNumberZeroValue!: boolean
  defaultNumberOverrideValue!: number
  hasDefaultNumberOverrideValue!: boolean
  defaultNumberWithTypeConstantValue!: number
  hasDefaultNumberWithTypeConstantValue!: boolean
  defaultNumberWithTypePropertyValue!: number
  hasDefaultNumberWithTypePropertyValue!: boolean

  defaultArrayValue!: any[]
  hasDefaultArrayValue!: boolean
  defaultArrayFilledValue!: { [key: string]: any }
  hasDefaultArrayFilledValue!: boolean
  defaultArrayOverrideValue!: { [key: string]: any }
  hasDefaultArrayOverrideValue!: boolean
  defaultArrayWithTypeConstantValue!: any[]
  hasDefaultArrayWithTypeConstantValue!: boolean
  defaultArrayWithTypePropertyValue!: any[]
  hasDefaultArrayWithTypePropertyValue!: boolean

  defaultObjectValue!: object
  hasDefaultObjectValue!: boolean
  defaultObjectPersonValue!: object
  hasDefaultObjectPersonValue!: boolean
  defaultObjectOverrideValue!: object
  hasDefaultObjectOverrideValue!: boolean
  defaultObjectWithTypeConstantValue!: object
  hasDefaultObjectWithTypeConstantValue!: boolean
  defaultObjectWithTypePropertyValue!: object
  hasDefaultObjectWithTypePropertyValue!: boolean
  
  lifecycleCallbacks: string[] = []

  initialize() {
    this.lifecycleCallbacks.push("initialize")
  }

  connect() {
    this.lifecycleCallbacks.push("connect")
  }

  defaultBooleanValueChanged() {
    this.lifecycleCallbacks.push("defaultBooleanValueChanged")
  }
}
