import { ClassMap } from "./class_map"
import { DataMap } from "./data_map"
import { Guide } from "./guide"
import { Logger } from "./logger"
import { Schema } from "./schema"
import { attributeValueContainsToken } from "./selectors"
import { TargetSet } from "./target_set"

export class Scope {
  readonly schema: Schema
  readonly element: Element
  readonly identifier: string
  readonly guide: Guide
  readonly targets = new TargetSet(this)
  readonly classes = new ClassMap(this)
  readonly data = new DataMap(this)

  constructor(schema: Schema, element: Element, identifier: string, logger: Logger) {
    this.schema = schema
    this.element = element
    this.identifier = identifier
    this.guide = new Guide(logger)
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
