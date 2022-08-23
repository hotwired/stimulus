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
    return outletNames.reduce((outlet, outletName) =>
         outlet
      || this.findOutlet(outletName)
    , undefined as Element | undefined)
  }

  findAll(...outletNames: string[]) {
    return outletNames.reduce((outlets, outletName) => [
      ...outlets,
      ...this.findAllOutlets(outletName),
    ], [] as Element[])
  }

  private findOutlet(outletName: string) {
    const selector = this.getSelectorForOutletName(outletName)
    if (selector) return this.findElement(selector)
  }

  private findAllOutlets(outletName: string) {
    const selector = this.getSelectorForOutletName(outletName)
    return selector ? this.findAllElements(selector) : []
  }

  private findElement(selector: string): Element | undefined {
    return this.element.matches(selector)
      ? this.element
      : this.scope.queryElements(selector)[0]
  }

  private findAllElements(selector: string): Element[] {
    return [
      ...this.element.matches(selector) ? [this.element] : [],
      ...this.scope.queryElements(selector)
    ]
  }

  private getSelectorForOutletName(outletName: string) {
    const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName)
    return this.controllerElement.getAttribute(attributeName)
  }
}
