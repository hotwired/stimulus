import { Trait, TraitConstructor } from "./trait"
import { Router } from "./router"
import { Scope } from "./scope"
import { Selector } from "./selector"
import { EventManager } from  "./event_manager"
import { EventListenerSet } from "./event_listener_set"

export class Context {
  parentTrait: Trait | null
  router: Router
  scope: Scope
  trait: Trait
  eventManager: EventManager
  connected: boolean

  constructor(parentTrait: Trait | null, router: Router, scope: Scope) {
    this.parentTrait = parentTrait
    this.router = router
    this.scope = scope
    this.trait = new this.traitConstructor(this)
    this.eventManager = new EventManager(this)
    this.connected = false
  }

  connect() {
    if (!this.connected) {
      this.eventManager.connect()
      this.trait.connect()
      this.connected = true
    }
  }

  disconnect() {
    if (this.connected) {
      this.trait.disconnect()
      this.eventManager.disconnect()
      this.connected = false
    }
  }

  get traitConstructor(): TraitConstructor {
    return this.scope.traitConstructor
  }

  get element(): Element {
    return this.router.element
  }

  get selector(): Selector {
    return this.scope.selector
  }

  get eventListeners(): EventListenerSet {
    return this.scope.eventListeners
  }
}
