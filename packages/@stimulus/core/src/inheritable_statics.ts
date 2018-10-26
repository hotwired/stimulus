import { Constructor } from "./constructor"

export function readInheritableStaticArrayValues<T, U = string>(constructor: Constructor<T>, propertyName: string) {
  const ancestors = getAncestorsForConstructor(constructor)
  return Array.from(ancestors.reduce((values, constructor) => {
    getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name))
    return values
  }, new Set as Set<U>))
}

export function readInheritableStaticObjectPairs<T, U>(constructor: Constructor<T>, propertyName: string) {
  const ancestors = getAncestorsForConstructor(constructor)
  return ancestors.reduce((pairs, constructor) => {
    pairs.push(...getOwnStaticObjectPairs(constructor, propertyName) as any)
    return pairs
  }, [] as [string, U][])
}

function getAncestorsForConstructor<T>(constructor: Constructor<T>) {
  const ancestors: Constructor<{}>[] = []
  while (constructor) {
    ancestors.push(constructor)
    constructor = Object.getPrototypeOf(constructor)
  }
  return ancestors.reverse()
}

function getOwnStaticArrayValues<T>(constructor: Constructor<T>, propertyName: string) {
  const definition = (constructor as any)[propertyName]
  return Array.isArray(definition) ? definition : []
}

function getOwnStaticObjectPairs<T, U>(constructor: Constructor<T>, propertyName: string) {
  const definition = (constructor as any)[propertyName]
  return definition ? Object.keys(definition).map(key => [key, definition[key]] as [string, U]) : []
}
