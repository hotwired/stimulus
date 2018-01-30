export interface Schema {
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
}

export const defaultSchema: Schema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target"
}
