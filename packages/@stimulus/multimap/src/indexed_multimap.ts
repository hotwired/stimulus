import { Multimap } from "./multimap"
import { add, del } from "./set_operations"

export class IndexedMultimap<K, V> extends Multimap<K, V> {
  private keysByValue: Map<V, Set<K>>

  constructor() {
    super()
    this.keysByValue = new Map
  }

  get values(): V[] {
    return Array.from(this.keysByValue.keys())
  }

  add(key: K, value: V) {
    super.add(key, value)
    add(this.keysByValue, value, key)
  }

  delete(key: K, value: V) {
    super.delete(key, value)
    del(this.keysByValue, value, key)
  }

  hasValue(value: V): boolean {
    return this.keysByValue.has(value)
  }

  getKeysForValue(value: V): K[] {
    const set = this.keysByValue.get(value)
    return set ? Array.from(set) : []
  }
}
