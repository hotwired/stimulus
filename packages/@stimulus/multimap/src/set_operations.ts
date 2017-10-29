export function add<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  fetch(map, key).add(value)
}

export function del<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  fetch(map, key).delete(value)
  prune(map, key)
}

export function fetch<K, V>(map: Map<K, Set<V>>, key: K): Set<V> {
  let values = map.get(key)
  if (!values) {
    values = new Set()
    map.set(key, values)
  }
  return values
}

export function prune<K, V>(map: Map<K, Set<V>>, key: K) {
  const values = map.get(key)
  if (values != null && values.size == 0) {
    map.delete(key)
  }
}
