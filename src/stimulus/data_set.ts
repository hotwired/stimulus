export class DataSet {
  identifier: string
  stringMap: DOMStringMap

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
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

  private getFormattedKey(key: string): string {
    return `${this.identifier}${capitalize(key)}`
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
