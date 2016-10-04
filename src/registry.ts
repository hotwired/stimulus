import { Instance } from "./instance"
import { Selector } from "./selector"

export class Registry {
  elements: WeakMap<Element, Map<Selector, Instance>>

  constructor() {
    this.elements = new WeakMap()
  }

  getInstanceForElementAndSelector(element: Element, selector: Selector): Instance | undefined {
    const instancesBySelector = this.elements.get(element)
    if (instancesBySelector) {
      const instance = instancesBySelector.get(selector)
      if (instance) {
        return instance
      }
    }
  }

  fetchInstanceForElementAndSelector(element: Element, selector: Selector): Instance {
    let instancesBySelector = this.elements.get(element)
    if (!instancesBySelector) {
      instancesBySelector = new Map<Selector, Instance>()
      this.elements.set(element, instancesBySelector)
    }

    let instance = instancesBySelector.get(selector)
    if (!instance) {
      instance = new Instance(element, selector)
      instancesBySelector.set(selector, instance)
    }

    return instance
  }

  deleteInstanceForElementAndSelector(element: Element, selector: Selector) {
    const instancesBySelector = this.elements.get(element)
    if (instancesBySelector) {
      if (instancesBySelector.has(selector)) {
        instancesBySelector.delete(selector)
      } 
    }    
  }
}