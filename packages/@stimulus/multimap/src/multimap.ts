import { add, del } from "./set_operations"

export class Multimap<K, V> {
  private valuesByKey: Map<K, Set<V>>

  constructor() {
    this.valuesByKey = new Map<K, Set<V>>()
  }

  get values(): V[] {
    const sets = Array.from(this.valuesByKey.values())
    return sets.reduce((values, set) => values.concat(Array.from(set)), <V[]> [])
  }

  get size(): number {
    const sets = Array.from(this.valuesByKey.values())
    return sets.reduce((size, set) => size + set.size, 0)
  }

  add(key: K, value: V) {
    add(this.valuesByKey, key, value)
  }

  delete(key: K, value: V) {
    del(this.valuesByKey, key, value)
  }

  has(key: K, value: V): boolean {
    const values = this.valuesByKey.get(key)
    return values != null && values.has(value)
  }

  hasKey(key: K): boolean {
    return this.valuesByKey.has(key)
  }

  hasValue(value: V): boolean {
    const sets = Array.from(this.valuesByKey.values())
    return sets.some(set => set.has(value))
  }

  getValuesForKey(key: K): V[] {
    const values = this.valuesByKey.get(key)
    return values ? Array.from(values) : []
  }

  getKeysForValue(value: V): K[] {
    return Array.from(this.valuesByKey)
      .filter(([key, values]) => values.has(value))
      .map(([key, values]) => key)
  }
}
