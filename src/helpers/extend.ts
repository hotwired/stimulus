export function extend(constructor: Function, properties: PropertyDescriptorMap) {
  const extendedConstructor = function() { return constructor.apply(this, arguments) }
  extendedConstructor.prototype = Object.create(constructor.prototype, properties)
  return extendedConstructor
}
