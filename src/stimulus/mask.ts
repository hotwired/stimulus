export class Mask {
  static forElementWithSelector(element: Element, selector: string): Mask {
    const elements = Array.from(element.querySelectorAll(selector))
    return new Mask(elements)
  }

  private elements: Element[]

  constructor(elements: Element[]) {
    this.elements = elements
  }

  get length(): number {
    return this.elements.length
  }

  has(element: Element): boolean {
    return this.elements.indexOf(element) >= 0
  }

  covers(element: Element): boolean {
    if (this.length) {
      return this.has(element) || this.contains(element)
    } else {
      return false
    }
  }

  private contains(element: Element): boolean {
    for (const memberElement of this.elements) {
      if (element.compareDocumentPosition(memberElement) & Node.DOCUMENT_POSITION_CONTAINS) {
        return true
      }
    }
    return false
  }
}
