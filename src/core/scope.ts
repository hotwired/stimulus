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
