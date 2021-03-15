export type Camelize<S extends string>
  = S extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<Camelize<Tail>>}`
    : S

export function camelize<S extends string>(value: S): Camelize<S> {
  return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase()) as any
}

export function capitalize<S extends string>(value: S): Capitalize<S> {
  return value.charAt(0).toUpperCase() + value.slice(1) as any
}

export function dasherize(value: string) {
  return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`)
}
