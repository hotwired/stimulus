import { DataMap } from "./data_map"
import { Schema } from "./schema"
import { TargetSet } from "./target_set"
import { attributeValueContainsToken } from "./selectors"

export class Scope {
  readonly schema: Schema
  readonly identifier: string
  readonly element: Element
  readonly targets: TargetSet
  readonly data: DataMap

  constructor(schema: Schema, identifier: string, element: Element) {
    this.schema = schema
    this.identifier = identifier
    this.element = element
    this.targets = new TargetSet(this)
    this.data = new DataMap(this)
  }

  findElement(selector: string): Element | undefined {
    return this.findAllElements(selector)[0]
  }

  findAllElements(selector: string): Element[] {
    const head = this.element.matches(selector) ? [this.element] : []
    const tail = this.filterElements(Array.from(this.element.querySelectorAll(selector)))
    return head.concat(tail)
  }

  filterElements(elements: Element[]): Element[] {
    return elements.filter(element => this.containsElement(element))
  }

  containsElement(element: Element) {
    return element.closest(this.controllerSelector) === this.element
  }

  private get controllerSelector(): string {
    return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier)
  }
}
