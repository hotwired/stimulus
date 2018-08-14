export interface ElementObserverDelegate {
  matchElement(element: Element): boolean
  matchElementsInTree(tree: Element): Element[]

  elementMatched?(element: Element): void
  elementUnmatched?(element: Element): void
  elementAttributeChanged?(element: Element, attributeName: string): void
}

export class ElementObserver {
  element: Element
  started: boolean
  private delegate: ElementObserverDelegate

  private elements: Set<Element>
  private mutationObserver: MutationObserver

  constructor(element: Element, delegate: ElementObserverDelegate) {
    this.element = element
    this.started = false
    this.delegate = delegate

    this.elements = new Set
    this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations))
  }

  start() {
    if (!this.started) {
      this.started = true
      this.mutationObserver.observe(this.element, { attributes: true, childList: true, subtree: true })
      this.refresh()
    }
  }

  stop() {
    if (this.started) {
      this.mutationObserver.takeRecords()
      this.mutationObserver.disconnect()
      this.started = false
    }
  }

  refresh() {
    if (this.started) {
      const matches = new Set(this.matchElementsInTree())

      for (const element of Array.from(this.elements)) {
        if (!matches.has(element)) {
          this.removeElement(element)
        }
      }

      for (const element of Array.from(matches)) {
        this.addElement(element)
      }
    }
  }

  // Mutation record processing

  private processMutations(mutations: MutationRecord[]) {
    if (this.started) {
      for (const mutation of mutations) {
        this.processMutation(mutation)
      }
    }
  }

  private processMutation(mutation: MutationRecord) {
    if (mutation.type == "attributes") {
      this.processAttributeChange(mutation.target, mutation.attributeName!)
    } else if (mutation.type == "childList") {
      this.processRemovedNodes(mutation.removedNodes)
      this.processAddedNodes(mutation.addedNodes)
    }
  }

  private processAttributeChange(node: Node, attributeName: string) {
    const element = node as Element
    if (this.elements.has(element)) {
      if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
        this.delegate.elementAttributeChanged(element, attributeName)
      } else {
        this.removeElement(element)
      }
    } else if (this.matchElement(element)) {
      this.addElement(element)
    }
  }

  private processRemovedNodes(nodes: NodeList) {
    for (const node of Array.from(nodes)) {
      const element = this.elementFromNode(node)
      if (element) {
        this.processTree(element, this.removeElement)
      }
    }
  }

  private processAddedNodes(nodes: NodeList) {
    for (const node of Array.from(nodes)) {
      const element = this.elementFromNode(node)
      if (element && this.elementIsActive(element)) {
        this.processTree(element, this.addElement)
      }
    }
  }

  // Element matching

  private matchElement(element: Element): boolean {
    return this.delegate.matchElement(element)
  }

  private matchElementsInTree(tree: Element = this.element): Element[] {
    return this.delegate.matchElementsInTree(tree)
  }

  private processTree(tree: Element, processor: (element: Element) => void) {
    for (const element of this.matchElementsInTree(tree)) {
      processor.call(this, element)
    }
  }

  private elementFromNode(node: Node): Element | undefined {
    if (node.nodeType == Node.ELEMENT_NODE) {
      return node as Element
    }
  }

  private elementIsActive(element: Element): boolean {
    if (element.isConnected != this.element.isConnected) {
      return false
    } else {
      return this.element.contains(element)
    }
  }

  // Element tracking

  private addElement(element: Element) {
    if (!this.elements.has(element)) {
      if (this.elementIsActive(element)) {
        this.elements.add(element)
        if (this.delegate.elementMatched) {
          this.delegate.elementMatched(element)
        }
      }
    }
  }

  private removeElement(element: Element) {
    if (this.elements.has(element)) {
      this.elements.delete(element)
      if (this.delegate.elementUnmatched) {
        this.delegate.elementUnmatched(element)
      }
    }
  }
}
