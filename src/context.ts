import { Controller } from "./controller"
import { Router } from "./router"
import { Scope } from "./scope"
import { Selector } from "./selector"

export class Context {
  parentController: Controller | null
  router: Router
  scope: Scope

  constructor(parentController: Controller | null, router: Router, scope: Scope) {
    this.parentController = parentController
    this.router = router
    this.scope = scope
  }

  get element(): Element {
    return this.router.element
  }

  get selector(): Selector {
    return this.scope.selector
  }
}
