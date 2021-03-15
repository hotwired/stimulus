export type Class<I = any, A extends any[] = any[]>
  = Constructor<I, A> & Prototype<I>

export type Constructor<I = any, A extends any[] = any[]>
  = new (...args: A) => I

export type Prototype<I = any>
  = { prototype: I }

export type OmitClass<C extends Constructor>
  = OmitConstructor<OmitPrototype<C>>

export type OmitConstructor<A>
  = Pick<A, keyof A>

export type OmitPrototype<A>
  = Omit<A, "prototype">

export function getAncestorsForConstructor<T>(constructor: Constructor<T>) {
  const ancestors: Constructor<{}>[] = []
  while (constructor?.prototype) {
    ancestors.push(constructor)
    constructor = Object.getPrototypeOf(constructor)
  }
  return ancestors.reverse()
}
