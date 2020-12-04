export interface Schema {
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
  classAttribute: string
}

export const defaultSchema: Schema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  classAttribute: "data-class"
}
