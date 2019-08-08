import { Scope } from "./scope"

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
    const formattedKey = this.getFormattedKey(key)
    return this.element.getAttribute(formattedKey)
  }

  set(key: string, value: string): string | null {
    const formattedKey = this.getFormattedKey(key)
    this.element.setAttribute(formattedKey, value)
    return this.get(key)
  }

  has(key: string): boolean {
    const formattedKey = this.getFormattedKey(key)
    return this.element.hasAttribute(formattedKey)
  }

  delete(key: string): boolean {
    if (this.has(key)) {
      const formattedKey = this.getFormattedKey(key)
      this.element.removeAttribute(formattedKey)
      return true
    } else {
      return false
    }
  }

  private getFormattedKey(key: string): string {
    return `data-${this.identifier}-${dasherize(key)}`
  }
}

function dasherize(value: string) {
  return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`)
}
