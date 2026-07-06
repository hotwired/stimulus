import { Scope } from "./scope"
import { AriaAttributeName } from "./aria"

export class AriaElementSet {
  readonly root: NonElementParentNode
  readonly scope: Scope

  constructor(root: NonElementParentNode, scope: Scope) {
    this.root = root
    this.scope = scope
  }

  has(attributeName: AriaAttributeName) {
    return this.find(attributeName) != null
  }

  find(...attributeNames: AriaAttributeName[]) {
    return attributeNames.reduce(
      (element, attributeName) => element || this.findElement(attributeName),
      null as Element | null
    )
  }

  findAll(...attributeNames: AriaAttributeName[]) {
    return attributeNames.reduce(
      (elements, attributeName) => [...elements, ...this.findAllElements(attributeName)],
      [] as Element[]
    )
  }

  private findElement(attributeName: AriaAttributeName) {
    const [id] = splitTokens(this.scope.element.getAttribute(attributeName))

    return this.root.getElementById(id) || null
  }

  private findAllElements(attributeName: AriaAttributeName): Element[] {
    const elements: Element[] = []

    for (const id of splitTokens(this.scope.element.getAttribute(attributeName))) {
      const element = document.getElementById(id)

      if (element) elements.push(element)
    }

    return elements
  }
}

function splitTokens(value: string | null): string[] {
  const tokens = (value || "").split(/\s+/)

  return tokens.filter((token) => !!token)
}
