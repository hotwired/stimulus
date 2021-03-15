import { Constructor, getAncestorsForConstructor } from "./class"
import { MixInto } from "./mixin"

type Blessing<B extends Constructor = Constructor, C extends B = B>
  = MixInto<B, C>

export function bless<C extends Constructor>(constructor: C): C {
  const ancestors = getAncestorsForConstructor(constructor)
  return ancestors.reduce((extended, ancestor) => {
    const blessings = getBlessingsForConstructor(ancestor)
    return blessings.reduce((blessed, blessing) => blessing(blessed), extended as any)
  }, constructor)
}

export function blessed<C extends Constructor>(constructor: C, blessing: Blessing<C>): C {
  registerBlessingForConstructor(constructor, blessing as any)
  return constructor
}

const blessingsByConstructor = new WeakMap<Constructor, Set<Blessing>>()

function registerBlessingForConstructor(constructor: Constructor, blessing: Blessing) {
  let blessings = blessingsByConstructor.get(constructor)

  if (!blessings) {
    blessingsByConstructor.set(constructor, blessings = new Set)
  }

  if (!blessings.has(blessing)) {
    blessings.add(blessing)
  }
}

function getBlessingsForConstructor(constructor: Constructor) {
  const blessings = blessingsByConstructor.get(constructor)
  return blessings ? Array.from(blessings) : []
}
