export interface Schema {
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
}

export interface SchemaOptions {
  controllerAttribute?: string
  actionAttribute?: string
  targetAttribute?: string
}

export const defaultSchema: Schema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target"
}

export function createSchema(schemaOptions: SchemaOptions = {}): Schema {
  return Object.assign({}, defaultSchema, schemaOptions)
}
