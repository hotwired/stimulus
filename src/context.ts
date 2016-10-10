import { Controller } from "./controller"
import { Instance } from "./instance"
import { Scope } from "./scope"
import { Selector } from "./selector"

export class Context {
  parentController: Controller | null
  instance: Instance
  scope: Scope

  constructor(parentController: Controller | null, instance: Instance, scope: Scope) {
    this.parentController = parentController
    this.instance = instance
    this.scope = scope
  }

  get element(): Element {
    return this.instance.element
  }

  get selector(): Selector {
    return this.scope.selector
  }
}
