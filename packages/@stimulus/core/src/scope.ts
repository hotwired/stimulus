import { Configuration } from "./configuration"
import { DataMap } from "./data_map"
import { TargetSet } from "./target_set"
import { attributeValueContainsToken } from "./selectors"

export class Scope {
  configuration: Configuration
  identifier: string
  element: Element
  targets: TargetSet
  data: DataMap

  constructor(configuration: Configuration, identifier: string, element: Element) {
    this.configuration = configuration
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
    return attributeValueContainsToken(this.configuration.controllerAttribute, this.identifier)
  }
}
