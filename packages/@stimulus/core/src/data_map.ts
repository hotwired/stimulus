import { Scope } from "./scope"
import { dasherize } from "./string_helpers"

export class DataMap {
  readonly scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  get element(): Element {
    return this.scope.element
  }

  get identifier(): string {
    return this.scope.identifier
  }

  get(key: string): string | null {
    const name = this.getAttributeNameForKey(key)
    return this.element.getAttribute(name)
  }

  set(key: string, value: string): string | null {
    const name = this.getAttributeNameForKey(key)
    this.element.setAttribute(name, value)
    return this.get(key)
  }

  has(key: string): boolean {
    const name = this.getAttributeNameForKey(key)
    return this.element.hasAttribute(name)
  }

  delete(key: string): boolean {
    if (this.has(key)) {
      const name = this.getAttributeNameForKey(key)
      this.element.removeAttribute(name)
      return true
    } else {
      return false
    }
  }

  getAttributeNameForKey(key: string): string {
    return `data-${this.identifier}-${dasherize(key)}`
  }
}
