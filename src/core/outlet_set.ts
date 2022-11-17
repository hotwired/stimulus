import { Scope } from "./scope"

export class OutletSet {
  readonly scope: Scope
  readonly controllerElement: Element

  constructor(scope: Scope, controllerElement: Element) {
    this.scope = scope
    this.controllerElement = controllerElement
  }

  get element() {
    return this.scope.element
  }

  get identifier() {
    return this.scope.identifier
  }

  get schema() {
    return this.scope.schema
  }

  has(outletName: string) {
    return this.find(outletName) != null
  }

  find(...outletNames: string[]) {
    return outletNames.reduce(
      (outlet, outletName) => outlet || this.findOutlet(outletName),
      undefined as Element | undefined
    )
  }

  findAll(...outletNames: string[]) {
    return outletNames.reduce(
      (outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)],
      [] as Element[]
    )
  }

  getSelectorForOutletName(outletName: string) {
    const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName)
    return this.controllerElement.getAttribute(attributeName)
  }

  private findOutlet(outletName: string) {
    const selector = this.getSelectorForOutletName(outletName)
    if (selector) return this.findElement(selector, outletName)
  }

  private findAllOutlets(outletName: string) {
    const selector = this.getSelectorForOutletName(outletName)
    return selector ? this.findAllElements(selector, outletName) : []
  }

  private findElement(selector: string, outletName: string): Element | undefined {
    const elements = this.scope.queryElements(selector)
    return elements.filter((element) => this.matchesElement(element, selector, outletName))[0]
  }

  private findAllElements(selector: string, outletName: string): Element[] {
    const elements = this.scope.queryElements(selector)
    return elements.filter((element) => this.matchesElement(element, selector, outletName))
  }

  private matchesElement(element: Element, selector: string, outletName: string): boolean {
    const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || ""
    return element.matches(selector) && controllerAttribute.split(" ").includes(outletName)
  }
}
