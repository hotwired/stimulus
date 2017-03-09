export class Mask {
  static forElementWithSelector(element: Element, selector: string): Mask {
    const elements = Array.from(element.querySelectorAll(selector))
    return new Mask(elements)
  }

  private maskedElements: Element[]

  constructor(maskedElements: Element[]) {
    this.maskedElements = maskedElements
  }

  get length(): number {
    return this.maskedElements.length
  }

  masks(element: Element): boolean {
    if (this.length) {
      return this.has(element) || this.contains(element)
    } else {
      return false
    }
  }

  private has(element: Element): boolean {
    return this.maskedElements.indexOf(element) >= 0
  }

  private contains(element: Element): boolean {
    for (const maskedElement of this.maskedElements) {
      if (maskedElement.contains(element)) {
        return true
      }
    }
    return false
  }
}
