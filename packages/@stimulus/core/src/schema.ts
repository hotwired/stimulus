export interface Schema {
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
  targetAttributeForScope(identifier: string): string
}

export const defaultSchema: Schema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  targetAttributeForScope: identifier => `data-${identifier}-target`
}
