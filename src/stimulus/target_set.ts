import { Context } from "./context"

export class TargetSet {
  context: Context

  constructor(context: Context) {
    this.context = context
  }

  get attributeName(): string {
    return this.context.targetAttribute
  }

  get element(): Element {
    return this.context.element
  }

  get identifier(): string {
    return this.context.identifier
  }

  has(targetName: string): boolean {
    return this.find(targetName) != null
  }

  find(targetName: string): Element | null {
    const selector = this.getSelectorForTargetName(targetName)
    const element = this.element.querySelector(selector)
    if (element && this.context.canControlElement(element)) {
      return element
    } else {
      return null
    }
  }

  findAll(targetName: string): Element[] {
    const selector = this.getSelectorForTargetName(targetName)
    const elements = Array.from(this.element.querySelectorAll(selector))
    return elements.filter(element => this.context.canControlElement(element))
  }

  matchesElementWithTargetName(element: Element, targetName: string): boolean {
    return element.getAttribute(this.attributeName) == targetName && this.context.canControlElement(element)
  }

  private getSelectorForTargetName(targetName: string): string {
    return `[${this.attributeName}~='${this.identifier}.${targetName}']`
  }
}
