export class Multimap<K, V> {
  private map: Map<K, Set<V>>

  constructor() {
    this.map = new Map<K, Set<V>>()
  }

  get values(): V[] {
    const sets = Array.from(this.map.values())
    return sets.reduce((values, set) => values.concat(Array.from(set)), <V[]> [])
  }

  get size(): number {
    const sets = Array.from(this.map.values())
    return sets.reduce((size, set) => size + set.size, 0)
  }

  add(key: K, value: V) {
    fetch(this.map, key, Set).add(value)
  }

  delete(key: K, value: V) {
    fetch(this.map, key, Set).delete(value)
    prune(this.map, key)
  }

  has(key: K, value: V): boolean {
    const values = this.map.get(key)
    return values != null && values.has(value)
  }

  hasKey(key: K): boolean {
    return this.map.has(key)
  }

  hasValue(value: V): boolean {
    const sets = Array.from(this.map.values())
    return sets.some(set => set.has(value))
  }

  get(key: K): V[] {
    const values = this.map.get(key)
    return values ? Array.from(values) : []
  }
}

export class Multimap2<K1, K2, V> {
  private map: Map<K1, Multimap<K2, V>>

  constructor() {
    this.map = new Map<K1, Multimap<K2, V>>()
  }

  get values(): V[] {
    const maps = Array.from(this.map.values())
    return maps.reduce((values, map) => values.concat(map.values), <V[]> [])
  }

  get size(): number {
    const maps = Array.from(this.map.values())
    return maps.reduce((size, map) => size + map.size, 0)
  }

  add(key1: K1, key2: K2, value: V) {
    fetch(this.map, key1, Multimap).add(key2, value)
  }

  delete(key1: K1, key2: K2, value: V) {
    fetch(this.map, key1, Multimap).delete(key2, value)
    prune(this.map, key1)
  }

  has(key1: K1, key2: K2, value: V): boolean {
    const map = this.map.get(key1)
    return map != null && map.has(key2, value)
  }

  hasKey(key1: K1, key2?: K2): boolean {
    if (arguments.length == 1) {
      return this.map.has(key1)
    } else {
      const map = this.map.get(key1)
      return map != null && map.hasKey(key2!)
    }
  }

  hasValue(value: V): boolean {
    const maps = Array.from(this.map.values())
    return maps.some(map => map.hasValue(value))
  }

  get(key1: K1, key2: K2): V[] {
    const map = this.map.get(key1)
    return map ? map.get(key2) : []
  }
}

interface MultimapValueConstructor<T extends MultimapValue> {
  new(): T
}

interface MultimapValue {
  size: number
}

function fetch<K, V extends MultimapValue>(map: Map<K, V>, key: K, constructor: MultimapValueConstructor<V>): V {
  let values = map.get(key)
  if (!values) {
    values = new constructor()
    map.set(key, values)
  }
  return values
}

function prune<K>(map: Map<K, MultimapValue>, key: K) {
  const values = map.get(key)
  if (values != null && values.size == 0) {
    map.delete(key)
  }
}
