export function defineTargetProperties(constructor: Function) {
  const prototype = constructor.prototype
  const targetNames = getTargetNamesForConstructor(constructor)
  targetNames.forEach(name => defineLinkedProperties(prototype, {
    [`${name}Target`]: {
      get() {
        const target = this.targets.find(name)
        if (target) {
          return target
        } else {
          throw new Error(`Missing target element "${this.identifier}.${name}"`)
        }
      }
    },
    [`${name}Targets`]: {
      get() {
        return this.targets.findAll(name)
      }
    }
  }))
}

function getTargetNamesForConstructor(constructor: Function) {
  const ancestors = getAncestorsForConstructor(constructor)
  return Array.from(ancestors.reduce((targetNames, constructor) => {
    getOwnTargetNamesForConstructor(constructor).forEach(name => targetNames.add(name))
    return targetNames
  }, new Set as Set<string>))
}

function getAncestorsForConstructor(constructor: Function) {
  const ancestors: Function[] = []
  while (constructor) {
    ancestors.push(constructor)
    constructor = Object.getPrototypeOf(constructor)
  }
  return ancestors
}

function getOwnTargetNamesForConstructor(constructor: Function) {
  const definition = constructor["targets"]
  return Array.isArray(definition) ? definition : []
}

function defineLinkedProperties(object: any, properties: PropertyDescriptorMap) {
  Object.keys(properties).forEach((name) => {
    if (!(name in object)) {
      const descriptor = properties[name]
      Object.defineProperty(object, name, descriptor)
    }
  })
}
