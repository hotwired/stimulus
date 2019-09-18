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
    return this.element.matches(selector)
      ? this.element
      : this.queryElements(selector).find(this.containsElement)
  }

  findAllElements(selector: string): Element[] {
    return [
      ...this.element.matches(selector) ? [this.element] : [],
      ...this.queryElements(selector).filter(this.containsElement)
    ]
  }

  containsElement = (element: Element): boolean => {
    return element.closest(this.controllerSelector) === this.element
  }

  private queryElements(selector: string): Element[] {
    return Array.from(this.element.querySelectorAll(selector))
  }

  private get controllerSelector(): string {
    return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier)
  }
}
