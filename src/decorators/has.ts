import { extend } from "../helpers/extend"

export function has(...attributes: string[]) {
  return function(constructor: Function) {
    const properties = compileAttributeDescriptorMap(attributes)
    return extend(constructor, properties)
  }
}

function compileAttributeDescriptorMap(attributes: string[]): PropertyDescriptorMap {
  const properties: PropertyDescriptorMap = {}
  attributes.forEach(attributeName => {
    properties[attributeName] = compileAttributeDescriptor(attributeName)
  })
  return properties
}

function compileAttributeDescriptor(attributeName: string): PropertyDescriptor {
  const suffix = findAttributeDescriptorSuffix(attributeName)
  if (!suffix) {
    throw new Error(`attribute "${attributeName}" has no known suffix`)
  }

  const compile = attributeDescriptorCompilers[suffix]
  const prefix = attributeName.slice(0, -suffix.length)
  return compile(prefix)
}

function findAttributeDescriptorSuffix(attributeName: string): string | undefined {
  for (const suffix in attributeDescriptorCompilers) {
    if (attributeName.endsWith(suffix)) {
      return suffix
    }
  }
}

const attributeDescriptorCompilers = {
  "Element": function(name) {
    return {
      get: function() { return this.targets.find(name) }
    }
  },

  "Elements": function(name) {
    return {
      get: function() { return this.targets.findAll(name) }
    }
  }
}
