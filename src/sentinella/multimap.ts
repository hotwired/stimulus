export class Multimap<Key, Value> {
  valuesByKey: Map<Key, Set<Value>>
  keysByValue: Map<Value, Set<Key>>

  constructor() {
    this.valuesByKey = new Map<Key, Set<Value>>()
    this.keysByValue = new Map<Value, Set<Key>>()
  }

  add(key: Key, value: Value) {
    add<Key, Value>(key, value, this.valuesByKey)
    add<Value, Key>(value, key, this.keysByValue)
  }

  delete(key: Key, value: Value) {
    del<Key, Value>(key, value, this.valuesByKey)
    del<Value, Key>(value, key, this.keysByValue)
  }

  has(key: Key, value: Value): boolean {
    const values = this.valuesByKey.get(key)
    return values ? values.has(value) : false
  }

  getKeysForValue(value: Value): Key[] {
    const keys = this.keysByValue.get(value)
    return keys ? Array.from(keys) : []
  }

  getValuesForKey(key: Key): Value[] {
    const values = this.valuesByKey.get(key)
    return values ? Array.from(values) : []
  }

  getValueCountForKey(key: Key): number {
    const values = this.valuesByKey.get(key)
    return values ? values.size : 0
  }
}

function add<A, B>(a: A, b: B, bsByA: Map<A, Set<B>>) {
  let bs

  if (bsByA.has(a)) {
    bs = bsByA.get(a)
  } else {
    bs = new Set<B>()
    bsByA.set(a, bs)
  }

  bs.add(b)
}

function del<A, B>(a: A, b: B, bsByA: Map<A, Set<B>>) {
  const bs = bsByA.get(a)

  if (bs) {
    bs.delete(b)
  }
}
