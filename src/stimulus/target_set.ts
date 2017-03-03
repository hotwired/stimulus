export class TargetSet {
  identifier: string
  element: Element

  constructor(identifier: string, element: Element) {
    this.identifier = identifier
    this.element = element
  }

  has(targetName: string): boolean {
    return this.find(targetName) != null
  }

  find(targetName: string): Element | null {
    const selector = this.getSelectorForTargetName(targetName)
    return this.element.querySelector(selector)
  }

  findAll(targetName: string): Element[] {
    const selector = this.getSelectorForTargetName(targetName)
    return Array.from(this.element.querySelectorAll(selector))
  }

  private getSelectorForTargetName(targetName: string): string {
    return `[data-${this.identifier}-target='${targetName}']`
  }
}