import { Trait } from "./trait"
import { Router } from "./router"
import { Scope } from "./scope"
import { Selector } from "./selector"

export class Context {
  parentTrait: Trait | null
  router: Router
  scope: Scope

  constructor(parentTrait: Trait | null, router: Router, scope: Scope) {
    this.parentTrait = parentTrait
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
