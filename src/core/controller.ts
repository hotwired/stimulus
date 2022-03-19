import { ClassPropertiesBlessing } from "./class_properties"
import { Constructor } from "./constructor"
import { Context } from "./context"
import { TargetPropertiesBlessing } from "./target_properties"
import { ValuePropertiesBlessing, ValueDefinitionMap } from "./value_properties"

export type ControllerConstructor = Constructor<Controller>

export class Controller<ElementType extends Element = Element> {
  static blessings = [ ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing ]
  static targets: string[] = []
  static values: ValueDefinitionMap = {}

  static get shouldLoad() {
    return true
  }

  readonly context: Context

  constructor(context: Context) {
    this.context = context
  }

  get application() {
    return this.context.application
  }

  get scope() {
    return this.context.scope
  }

  get element() {
    return this.scope.element as ElementType
  }

  get identifier() {
    return this.scope.identifier
  }

  get targets() {
    return this.scope.targets
  }

  get classes() {
    return this.scope.classes
  }

  get data() {
    return this.scope.data
  }

  initialize() {
    // Override in your subclass to set up initial controller state
  }

  connect() {
    // Override in your subclass to respond when the controller is connected to the DOM
  }

  disconnect() {
    // Override in your subclass to respond when the controller is disconnected from the DOM
  }

  dispatch(eventName: string, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
    const type = prefix ? `${prefix}:${eventName}` : eventName
    const event = new CustomEvent(type, { detail, bubbles, cancelable })
    target.dispatchEvent(event)
    return event
  }
}
