import { Scope } from "./scope"
import { attributeValueContainsToken } from "./selectors"

export class TargetSet {
  readonly scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  get element() {
    return this.scope.element
  }

  get identifier() {
    return this.scope.identifier
  }

  get schema() {
    return this.scope.schema
  }

  has(targetName: string) {
    return this.find(targetName) != null
  }

  find(...targetNames: string[]) {
    return targetNames.reduce((target, targetName) =>
         target
      || this.findTarget(targetName)
      || this.findLegacyTarget(targetName)
    , undefined as Element | undefined)
  }

  findAll(...targetNames: string[]) {
    return targetNames.reduce((targets, targetName) => [
      ...targets,
      ...this.findAllTargets(targetName),
      ...this.findAllLegacyTargets(targetName)
    ], [] as Element[])
  }

  private findTarget(targetName: string) {
    const selector = this.getSelectorForTargetName(targetName)
    return this.scope.findElement(selector)
  }

  private findAllTargets(targetName: string) {
    const selector = this.getSelectorForTargetName(targetName)
    return this.scope.findAllElements(selector)
  }

  private getSelectorForTargetName(targetName: string) {
    const attributeName = `data-${this.identifier}-target`
    return attributeValueContainsToken(attributeName, targetName)
  }

  private findLegacyTarget(targetName: string) {
    const selector = this.getLegacySelectorForTargetName(targetName)
    return this.deprecate(this.scope.findElement(selector), targetName)
  }

  private findAllLegacyTargets(targetName: string) {
    const selector = this.getLegacySelectorForTargetName(targetName)
    return this.scope.findAllElements(selector).map(element => this.deprecate(element, targetName))
  }

  private getLegacySelectorForTargetName(targetName: string) {
    const targetDescriptor = `${this.identifier}.${targetName}`
    return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor)
  }

  private deprecate<T>(element: T, targetName: string) {
    if (element) {
      const { identifier } = this
      const attributeName = this.schema.targetAttribute
      this.guide.warn(element, `target:${targetName}`,
        `Please replace ${attributeName}="${identifier}.${targetName}" with data-${identifier}-target="${targetName}". ` +
        `The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`)
    }
    return element
  }

  private get guide() {
    return this.scope.guide
  }
}
