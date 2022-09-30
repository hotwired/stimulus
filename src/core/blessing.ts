import { Constructor } from "./constructor"
import { readInheritableStaticArrayValues } from "./inheritable_statics"

export type Blessing<T> = (constructor: Constructor<T>) => PropertyDescriptorMap

export interface Blessable<T> extends Constructor<T> {
  readonly blessings?: Blessing<T>[]
}

export function bless<T>(constructor: Blessable<T>): Constructor<T> {
  return shadow(constructor, getBlessedProperties(constructor))
}

function shadow<T>(constructor: Constructor<T>, properties: PropertyDescriptorMap) {
  const shadowConstructor = extend(constructor)
  const shadowProperties = getShadowProperties(constructor.prototype, properties)
  Object.defineProperties(shadowConstructor.prototype, shadowProperties)
  return shadowConstructor
}

function getBlessedProperties<T>(constructor: Constructor<T>) {
  const blessings = readInheritableStaticArrayValues(constructor, "blessings") as Blessing<T>[]
  return blessings.reduce((blessedProperties, blessing) => {
    const properties = blessing(constructor)
    for (const key in properties) {
      const descriptor = blessedProperties[key] || ({} as PropertyDescriptor)
      blessedProperties[key] = Object.assign(descriptor, properties[key])
    }
    return blessedProperties
  }, {} as PropertyDescriptorMap)
}

function getShadowProperties(prototype: any, properties: PropertyDescriptorMap) {
  return getOwnKeys(properties).reduce((shadowProperties, key) => {
    const descriptor = getShadowedDescriptor(prototype, properties, key)
    if (descriptor) {
      Object.assign(shadowProperties, { [key]: descriptor })
    }
    return shadowProperties
  }, {} as PropertyDescriptorMap)
}

function getShadowedDescriptor(prototype: any, properties: PropertyDescriptorMap, key: string | symbol) {
  const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key)
  const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor
  if (!shadowedByValue) {
    const descriptor = Object.getOwnPropertyDescriptor(properties, key)!.value
    if (shadowingDescriptor) {
      descriptor.get = shadowingDescriptor.get || descriptor.get
      descriptor.set = shadowingDescriptor.set || descriptor.set
    }
    return descriptor
  }
}

const getOwnKeys = (() => {
  if (typeof Object.getOwnPropertySymbols == "function") {
    return (object: any) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)]
  } else {
    return Object.getOwnPropertyNames
  }
})()

const extend = (() => {
  function extendWithReflect<T extends Constructor<any>>(constructor: T): T {
    function extended() {
      return Reflect.construct(constructor, arguments, new.target)
    }

    extended.prototype = Object.create(constructor.prototype, {
      constructor: { value: extended },
    })

    Reflect.setPrototypeOf(extended, constructor)
    return extended as any
  }

  function testReflectExtension() {
    const a = function (this: any) {
      this.a.call(this)
    } as any
    const b = extendWithReflect(a)
    b.prototype.a = function () {}
    return new b()
  }

  try {
    testReflectExtension()
    return extendWithReflect
  } catch (error: any) {
    return <T extends Constructor<any>>(constructor: T) => class extended extends constructor {}
  }
})()
