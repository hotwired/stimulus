export interface ElementObserverDelegate {
  matchElement(element: Element): boolean
  matchElementsInTree(tree: Element): Element[]

  elementMatched(element: Element)
  elementUnmatched(element: Element)
  elementAttributeChanged(element: Element, attributeName: string)
}

export class ElementObserver {
  element: Element
  delegate: ElementObserverDelegate
  elements: Set<Element>
  mutationObserver: MutationObserver

  constructor(element, delegate) {
    this.element = element
    this.delegate = delegate
    this.elements = new Set<Element>()
    this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations))
  }

  start() {
    this.mutationObserver.observe(this.element, { attributes: true, childList: true, subtree: true })
  }

  stop() {
    this.mutationObserver.takeRecords()
    this.mutationObserver.disconnect()
  }

  // Mutation record processing

  private processMutations(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      this.processMutation(mutation)
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
    const element = <Element>node
    if (this.elements.has(element)) {
      if (this.matchElement(element)) {
        this.delegate.elementAttributeChanged(element, attributeName)
      } else {
        this.removeElement(element)
      }
    } else if (this.matchElement(element)) {
      this.addElement(element)
    }
  }

  private processRemovedNodes(nodes: NodeList) {
    for (const node of nodes) {
      this.processNode(node, this.removeElement)
    }
  }

  private processAddedNodes(nodes: NodeList) {
    for (const node of nodes) {
      this.processNode(node, this.addElement)
    }
  }

  // Element matching

  private matchElement(element: Element): boolean {
    return this.delegate.matchElement(element)
  }

  private matchElementsInTree(tree: Element): Element[] {
    return this.delegate.matchElementsInTree(tree)
  }

  private processNode(node: Node, processor: (element: Element) => void) {
    const tree = this.elementFromNode(node)
    if (tree) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element)
      }
    }
  }

  private elementFromNode(node: Node): Element | undefined {
    if (node.nodeType == Node.ELEMENT_NODE) {
      return <Element>node
    }
  }

  // Element tracking

  private addElement(element: Element) {
    if (!this.elements.has(element)) {
      this.elements.add(element)
      this.delegate.elementMatched(element)
    }
  }

  private removeElement(element: Element) {
    if (this.elements.has(element)) {
      this.elements.delete(element)
      this.delegate.elementUnmatched(element)
    }
  }
}
