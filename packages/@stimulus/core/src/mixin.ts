import { Class, Constructor, OmitClass, getAncestorsForConstructor  } from "./class"

export class Mixin<
  AllowedBase extends Constructor = Constructor<{}>,
  Extended extends AllowedBase = AllowedBase,
  Derived extends Constructor = Mix<AllowedBase, Extended>
> {
  private readonly mixInto: MixInto<AllowedBase, Extended>

  static define<
    AllowedBase extends Constructor = Constructor<{}>,
    Extended extends AllowedBase = AllowedBase
  >(mixInto: MixInto<AllowedBase, Extended>): Mixin<AllowedBase, Extended> {
    return new Mixin(mixInto)
  }

  static forConstructor<C extends Constructor>(constructor: C) {
    return new Mixin<C>(I)
  }

  static forInterface<I>() {
    return new Mixin<I extends Constructor ? I : Constructor<I>>(I)
  }

  static forMixin<M extends Mixin>(mixin: M) {
    return new Mixin<DerivedType<M>>(I)
  }

  constructor(mixInto: MixInto<AllowedBase, Extended>) {
    this.mixInto = mixInto
  }

  extends<ActualBase extends AllowedBase>(base: ActualBase): Mix<ActualBase, Extended> {
    return this.mixInto(base) as any
  }

  define<Defined extends Derived>(mixInto: MixInto<Derived, Defined>) {
    return new Mixin(base => {
      const extended = this.extends(base as any)
      return mixInto(extended as any)
    })
  }

  defineGetter<N extends string, V>(name: N, get: (this: InstanceType<Extended>) => V): Mixin<AllowedBase, MixReadonlyProperty<Extended, N, V>> {
    return this.defineProperty(name, { get })
  }

  defineSetter<N extends string, V>(name: N, set: (this: InstanceType<Extended>, value: V) => void): Mixin<AllowedBase, MixWritableProperty<Extended, N, V>> {
    return this.defineProperty(name, { set })
  }

  defineValue<N extends string, V>(name: N, value: V): Mixin<AllowedBase, MixReadonlyProperty<Extended, N, V>> {
    return this.defineProperty(name, { value })
  }

  defineMethod<N extends string, M extends (this: InstanceType<Extended>, ...args: A) => V, A extends unknown[], V>(name: N, method: M): Mixin<AllowedBase, MixReadonlyProperty<Extended, N, M>> {
    return this.defineValue(name, method)
  }

  private defineProperty(name: string, descriptor: PropertyDescriptor) {
    return this.define(base => {
      const shadowedDescriptor = getInstancePropertyDescriptor(base, name)
      if (descriptor.get && shadowedDescriptor?.set) {
        descriptor = { ...descriptor, set: shadowedDescriptor.set }
      } else if (descriptor.set && shadowedDescriptor?.get) {
        descriptor = { ...descriptor, get: shadowedDescriptor.get }
      }

      const extended = class extends base {}
      Object.defineProperty(extended.prototype, name, descriptor)
      return extended
    }) as any
  }
}

function getInstancePropertyDescriptor(constructor: Constructor, name: string) {
  for (const ancestor of getAncestorsForConstructor(constructor).reverse()) {
    const descriptor = Object.getOwnPropertyDescriptor(ancestor.prototype, name)
    if (descriptor) {
      return descriptor
    }
  }
}

const I = <A>(a: A) => a

export type MixInto<
  AllowedBase extends Constructor,
  Extended extends Constructor
> = (base: AllowedBase) => Extended

export type Mix<B, T>
  = B extends Constructor
    ? T extends Constructor
      ? MixConstructorAndConstructor<B, T>
      : MixConstructorAndProperties<B, T>
    : MixPropertiesAndProperties<B, T>

export type DerivedType<M extends Mixin>
  = M extends Mixin<infer AllowedBase, infer Extended>
    ? Mix<AllowedBase, Extended>
    : never

type MixConstructorAndConstructor<B extends Constructor, T extends Constructor>
  = B extends Constructor<infer BI, infer A>
    ? T extends Constructor<infer TI, A>
      ? Class<BI & TI, A> & OmitClass<B> & OmitClass<T>
      : never
    : never

type MixConstructorAndProperties<B extends Constructor, T>
  = B extends Constructor<infer BI, infer A>
    ? Class<BI & T, A> & OmitClass<B>
    : never

type MixPropertiesAndProperties<B, T>
  = B & T

type MixReadonlyProperty<B extends Constructor, N extends string, V>
  = B & Class<
      N extends keyof InstanceType<B>
        ? { readonly [K in N as K]: V }
        : { -readonly [K in N as K]: V }
    >

type MixWritableProperty<B extends Constructor, N extends string, V>
  = B & Class<{ -readonly [K in N as K]: V }>
