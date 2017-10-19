import { Configuration } from "./configuration"

export type ElementQueryDescriptor = string | ElementQueryOptions
export type ElementQueryOptions = {
  controller: string
  target?: string
  action?: string
}

export class ElementQuery {
  configuration: Configuration
  descriptor: ElementQueryDescriptor

  constructor(configuration: Configuration, descriptor: ElementQueryDescriptor) {
    this.configuration = configuration
    this.descriptor = descriptor
  }

  get firstElement(): Element | undefined {
    return this.candidateElements.find(element => this.matchAttributesForElement(element))
  }

  get allElements(): Element[] {
    return this.candidateElements.filter(element => this.matchAttributesForElement(element))
  }

  private get candidateElements(): Element[] {
    const candidateSelector = this.candidateSelector
    const childCandidates = Array.from(this.rootElement.querySelectorAll(candidateSelector))

    if (this.rootElement.matches(candidateSelector)) {
      return [this.rootElement, ...childCandidates]
    } else {
      return childCandidates
    }
  }

  private get candidateSelector() {
    const descriptor = this.descriptor

    if (typeof descriptor == "string") {
      return descriptor
    } else if (descriptor.target) {
      return buildAttributeSelector(this.targetAttribute)
    } else if (descriptor.action) {
      return buildAttributeSelector(this.actionAttribute)
    } else {
      return buildAttributeSelector(this.controllerAttribute, descriptor.controller)
    }
  }

  private matchAttributesForElement(element: Element) {
    const descriptor = this.descriptor

    if (typeof descriptor == "string") {
      return true
    } else if (descriptor.target) {
      return this.matchTargetAttributeForElement(element, descriptor.controller, descriptor.target)
    } else if (descriptor.action) {
      return this.matchActionAttributeForElement(element, descriptor.controller, descriptor.action)
    } else {
      return true
    }
  }

  private matchTargetAttributeForElement(element, identifier, targetName) {
    const tokenValue = `${identifier}.${targetName}`
    return getTokensForAttribute(element, this.targetAttribute).indexOf(tokenValue) != -1
  }

  private matchActionAttributeForElement(element, identifier, methodName) {
    const tokenValue = `${identifier}#${methodName}`
    return getTokensForAttribute(element, this.actionAttribute).some(token => {
      return token.replace(/^(.+?)->/, "") == tokenValue
    })
  }

  private get rootElement() {
    return this.configuration.rootElement
  }

  private get controllerAttribute() {
    return this.configuration.controllerAttribute
  }

  private get targetAttribute() {
    return this.configuration.targetAttribute
  }

  private get actionAttribute() {
    return this.configuration.actionAttribute
  }
}

function buildAttributeSelector(attributeName: string, tokenValue?: string) {
  if (tokenValue) {
    return `[${attributeName}~='${tokenValue}']`
  } else {
    return `[${attributeName}]`
  }
}

function getTokensForAttribute(element: Element, attributeName: string) {
  const attributeValue = element.getAttribute(attributeName) || ""
  return attributeValue.trim().split(/\s+/)
}
