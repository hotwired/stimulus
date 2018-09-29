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
    key = this.getAttributeNameForKey(key)
    return this.element.getAttribute(key)
  }

  set(key: string, value: string): string | null {
    key = this.getAttributeNameForKey(key)
    this.element.setAttribute(key, value)
    return this.get(key)
  }

  has(key: string): boolean {
    key = this.getAttributeNameForKey(key)
    return this.element.hasAttribute(key)
  }

  delete(key: string): boolean {
    if (this.has(key)) {
      key = this.getAttributeNameForKey(key)
      this.element.removeAttribute(key)
      return true
    } else {
      return false
    }
  }

  getAttributeNameForKey(key: string): string {
    return `data-${this.identifier}-${dasherize(key)}`
  }
}
