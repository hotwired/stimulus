import { Scope } from "./scope"

export class ClassMap {
  readonly scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  has(name: string) {
    return this.data.has(this.getDataKey(name))
  }

  get(name: string) {
    return this.getAll(name)[0]
  }

  getAll(name: string) {
    const tokenString = this.data.get(this.getDataKey(name)) || ""
    return tokenString.trim().split(/\s+/).filter(content => content.length)
  }

  getAttributeName(name: string) {
    return this.data.getAttributeNameForKey(this.getDataKey(name))
  }

  getDataKey(name: string) {
    return `${name}-class`
  }

  get data() {
    return this.scope.data
  }
}
