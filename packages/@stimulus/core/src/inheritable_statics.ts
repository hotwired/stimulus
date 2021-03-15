import { Constructor, getAncestorsForConstructor } from "./class"

export function readInheritableStaticArrayValues<U = string>(constructor: Constructor, propertyName: string) {
  const ancestors = getAncestorsForConstructor(constructor)
  return Array.from(ancestors.reduce((values, constructor) => {
    getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name))
    return values
  }, new Set as Set<U>))
}

export function readInheritableStaticObjectPairs<U>(constructor: Constructor, propertyName: string) {
  const ancestors = getAncestorsForConstructor(constructor)
  return ancestors.reduce((pairs, constructor) => {
    pairs.push(...getOwnStaticObjectPairs(constructor, propertyName) as any)
    return pairs
  }, [] as [string, U][])
}

function getOwnStaticArrayValues(constructor: Constructor, propertyName: string) {
  const definition = (constructor as any)[propertyName]
  return Array.isArray(definition) ? definition : []
}

function getOwnStaticObjectPairs<U>(constructor: Constructor, propertyName: string) {
  const definition = (constructor as any)[propertyName]
  return definition ? Object.keys(definition).map(key => [key, definition[key]] as [string, U]) : []
}
