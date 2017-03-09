export interface TargetSetDelegate {
  canControlElement(element: Element)
}

export class TargetSet {
  identifier: string
  element: Element
  private delegate: TargetSetDelegate

  constructor(identifier: string, element: Element, delegate: TargetSetDelegate) {
    this.identifier = identifier
    this.element = element
    this.delegate = delegate
  }

  has(targetName: string): boolean {
    return this.find(targetName) != null
  }

  find(targetName: string): Element | null {
    const selector = this.getSelectorForTargetName(targetName)
    const element = this.element.querySelector(selector)
    if (element && this.delegate.canControlElement(element)) {
      return element
    } else {
      return null
    }
  }

  findAll(targetName: string): Element[] {
    const selector = this.getSelectorForTargetName(targetName)
    const elements = Array.from(this.element.querySelectorAll(selector))
    return elements.filter(element => this.delegate.canControlElement(element))
  }

  private getSelectorForTargetName(targetName: string): string {
    return `[data-${this.identifier}-target='${targetName}']`
  }
}
