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
    fetch(this.map, key).add(value)
  }

  delete(key: K, value: V) {
    fetch(this.map, key).delete(value)
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

function fetch<K, V>(map: Map<K, Set<V>>, key: K): Set<V> {
  let values = map.get(key)
  if (!values) {
    values = new Set()
    map.set(key, values)
  }
  return values
}

function prune<K, V>(map: Map<K, Set<V>>, key: K) {
  const values = map.get(key)
  if (values != null && values.size == 0) {
    map.delete(key)
  }
}
