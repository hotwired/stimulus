export function memoize(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  const memos = new WeakMap<any, any>()
  const method = descriptor.value
  
  if (!method || method.length > 0) {
    throw new Error("memoize requires a zero-argument function")
  }

  descriptor.value = function() {
    if (memos.has(this)) {
      return memos.get(this)
    } else {
      const value = method.call(this)
      memos.set(this, value)
      return value
    }
  }
}
