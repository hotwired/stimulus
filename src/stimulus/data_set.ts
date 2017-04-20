export class DataSet {
  identifier: string
  keyPattern: RegExp
  stringMap: DOMStringMap

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.keyPattern = new RegExp(`^${identifier}([A-Z]+.*)`)
    this.stringMap = (element as HTMLElement).dataset
  }

  get(key: string): string | undefined {
    key = this.getFormattedKey(key)
    return this.stringMap[key]
  }

  set(key: string, value) {
    key = this.getFormattedKey(key)
    return this.stringMap[key] = value
  }

  toJSON() {
    const result = {}
    for (const key in this.stringMap) {
      const unformattedKey = this.getUnformattedKey(key)
      if (unformattedKey) {
        result[unformattedKey] = this.stringMap[key]
      }
    }
    return result
  }

  private getFormattedKey(key: string): string {
    return `${this.identifier}${capitalize(key)}`
  }

  private getUnformattedKey(key: string): string | void {
    const matches = key.match(this.keyPattern)
    if (matches) {
      return uncapitalize(matches[1])
    }
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function uncapitalize(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}
