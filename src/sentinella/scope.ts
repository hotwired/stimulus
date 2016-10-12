import { Selector } from "./selector"
import { ControllerConstructor, DefaultController } from "./controller"

export type ScopeOptions = {
  selector: Selector | string,
  controllerConstructor?: ControllerConstructor,
  eventListeners?: EventListenerSet,
  childScopes?: ScopeOptions[]
} | Scope

export type EventListenerSet = {
  [key: string]: EventListener
}

export class Scope {
  static wrap(definition: ScopeOptions): Scope {
    if (definition instanceof Scope) {
      return definition
    } else {
      return new Scope(definition)
    }
  }

  selector: Selector
  controllerConstructor: ControllerConstructor
  eventListeners: EventListenerSet
  childScopes: Scope[]

  constructor({selector, controllerConstructor, eventListeners, childScopes}: ScopeOptions) {
    this.selector = Selector.get(selector)
    this.controllerConstructor = controllerConstructor || <ControllerConstructor> <Function> DefaultController
    this.eventListeners = eventListeners || {}
    this.childScopes = (<Scope[]> (childScopes || [])).map(Scope.wrap)
  }
}
