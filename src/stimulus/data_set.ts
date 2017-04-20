export class DataSet {
  identifier: string
  element: Element

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.element = element
  }

  get(key: string): string | null {
    const name = this.getAttributeNameForKey(key)
    return this.element.getAttribute(name)
  }

  set(key: string, value): void {
    const name = this.getAttributeNameForKey(key)
    this.element.setAttribute(name, value)
  }

  private getAttributeNameForKey(key: string): string {
    return `data-${this.identifier}-${dasherize(key)}`
  }
}

function dasherize(camelString) {
  if (/[A-Z]/.test(camelString)) {
    const element = document.createElement("span")
    element.dataset[camelString] = ""
    return element.attributes[0].name.slice(5)
  } else {
    return camelString
  }
}
