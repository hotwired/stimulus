import { Configuration } from "./configuration"
import { Scope } from "./scope"
import { attributeValueContainsToken } from "./selectors"

export class TargetSet {
  scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  get element(): Element {
    return this.scope.element
  }

  get identifier(): string {
    return this.scope.identifier
  }

  get configuration(): Configuration {
    return this.scope.configuration
  }

  has(targetName: string): boolean {
    return this.find(targetName) != null
  }

  find(targetName: string): Element | undefined {
    const selector = this.getSelectorForTargetName(targetName)
    return this.scope.findElement(selector)
  }

  findAll(targetName: string): Element[] {
    const selector = this.getSelectorForTargetName(targetName)
    return this.scope.findAllElements(selector)
  }

  private getSelectorForTargetName(targetName: string): string {
    const targetDescriptor = `${this.identifier}.${targetName}`
    return attributeValueContainsToken(this.configuration.targetAttribute, targetDescriptor)
  }
}
