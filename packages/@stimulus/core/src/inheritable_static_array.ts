import { Constructor } from "./constructor"

export function readInheritableStaticArray<T, U = string>(constructor: Constructor<T>, propertyName: string) {
  const ancestors = getAncestorsForConstructor(constructor)
  return Array.from(ancestors.reduce((values, constructor) => {
    getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name))
    return values
  }, new Set as Set<U>))
}

function getAncestorsForConstructor<T>(constructor: Constructor<T>) {
  const ancestors: Constructor<{}>[] = []
  while (constructor) {
    ancestors.push(constructor)
    constructor = Object.getPrototypeOf(constructor)
  }
  return ancestors
}

function getOwnStaticArrayValues<T>(constructor: Constructor<T>, propertyName: string) {
  const definition = (constructor as any)[propertyName]
  return Array.isArray(definition) ? definition : []
}
