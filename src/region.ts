import { scopesForDefinition } from "./definition"
import { Scope } from "./scope"

export class Region {
  element: Element
  scopes: Set<Scope>

  constructor(element: Element) {
    this.element = element
    this.scopes = new Set()
  }

  define(definition) {
    for (const scope of scopesForDefinition(definition)) {
      this.scopes.add(scope)
    }
  }
}
