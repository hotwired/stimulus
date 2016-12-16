import { Context } from "./context"

export interface TraitConstructor {
  new(context: Context): Trait
  prototype: Trait
}

export interface Trait {
  context: Context

  initialize()
  connect()
  disconnect()
}

export function DefaultTrait(context: Context) {
  this.context = context
  this.initialize()
  return this
}

DefaultTrait.prototype = {
  initialize() {},
  connect() {},
  disconnect() {},

  get element(): Element {
    return this.context.element
  },

  get parentTrait(): Trait | undefined {
    return this.context.parentTrait
  }
}

export function traitConstructorForPrototype(prototype): TraitConstructor {
  function Trait(context: Context) {
    return DefaultTrait.call(this, context)
  }

  const extendedPrototype = Object.create(DefaultTrait.prototype)
  Trait.prototype = extend(extendedPrototype, prototype)

  return <TraitConstructor> <Function> Trait
}

function extend(target, source) {
  for (const key in source) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key)
    Object.defineProperty(target, key, descriptor)
  }

  return target
}
