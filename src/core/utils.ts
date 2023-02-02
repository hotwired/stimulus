export function isSomething(object: any): boolean {
  return object !== null && object !== undefined
}

export function hasProperty(object: any, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, property)
}
