export interface StringMapObserverDelegate {
  getStringMapKeyForAttribute(attributeName: string): string | undefined
  stringMapKeyAdded?(key: string, attributeName: string): void
  stringMapValueChanged?(value: string | null, key: string, oldValue: string | null): void
  stringMapKeyRemoved?(key: string, attributeName: string, oldValue: string | null): void
}

export class StringMapObserver {
  readonly element: Element
  readonly delegate: StringMapObserverDelegate
  private started: boolean
  private stringMap: Map<string, string>
  private mutationObserver: MutationObserver

  constructor(element: Element, delegate: StringMapObserverDelegate) {
    this.element = element
    this.delegate = delegate
    this.started = false
    this.stringMap = new Map
    this.mutationObserver = new MutationObserver(mutations => this.processMutations(mutations))
  }

  start() {
    if (!this.started) {
      this.started = true
      this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true })
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
      for (const attributeName of this.knownAttributeNames) {
        this.refreshAttribute(attributeName, null)
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
    const attributeName = mutation.attributeName
    if (attributeName) {
      this.refreshAttribute(attributeName, mutation.oldValue)
    }
  }

  // State tracking

  private refreshAttribute(attributeName: string, oldValue: string | null) {
    const key = this.delegate.getStringMapKeyForAttribute(attributeName)
    if (key != null) {
      if (!this.stringMap.has(attributeName)) {
        this.stringMapKeyAdded(key, attributeName)
      }

      const value = this.element.getAttribute(attributeName)
      if (this.stringMap.get(attributeName) != value) {
        this.stringMapValueChanged(value, key, oldValue)
      }

      if (value == null) {
        const oldValue = this.stringMap.get(attributeName)
        this.stringMap.delete(attributeName)
        if (oldValue) this.stringMapKeyRemoved(key, attributeName, oldValue)
      } else {
        this.stringMap.set(attributeName, value)
      }
    }
  }

  private stringMapKeyAdded(key: string, attributeName: string) {
    if (this.delegate.stringMapKeyAdded) {
      this.delegate.stringMapKeyAdded(key, attributeName)
    }
  }

  private stringMapValueChanged(value: string | null, key: string, oldValue: string | null) {
    if (this.delegate.stringMapValueChanged) {
      this.delegate.stringMapValueChanged(value, key, oldValue)
    }
  }

  private stringMapKeyRemoved(key: string, attributeName: string, oldValue: string | null) {
    if (this.delegate.stringMapKeyRemoved) {
      this.delegate.stringMapKeyRemoved(key, attributeName, oldValue)
    }
  }

  private get knownAttributeNames() {
    return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)))
  }

  private get currentAttributeNames() {
    return Array.from(this.element.attributes).map(attribute => attribute.name)
  }

  private get recordedAttributeNames() {
    return Array.from(this.stringMap.keys())
  }
}
