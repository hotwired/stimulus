import { Selector } from "./selector"
import { memoize } from "./util"

export class SelectorSet {
  selectors: Map<string, Selector>

  constructor(selectors: Selector[] = []) {
    this.selectors = new Map<string, Selector>()
    for (const selector of selectors) {
      this.selectors.set(selector.toString(), selector)
    }
  }

  [Symbol.iterator]() {
    return this.selectors.values()
  }

  add(selector: Selector | string): SelectorSet {
    if (this.has(selector)) {
      return this
    } else {
      selector = Selector.wrap(selector)
      const selectors = this.toArray().concat(selector)
      return new SelectorSet(selectors)
    }
  }

  delete(selector: Selector | string): SelectorSet {
    if (this.has(selector)) {
      const value = Selector.wrap(selector).toString()
      const selectors = this.toArray().filter((s) => s.toString() !== value)
      return new SelectorSet(selectors)
    } else {
      return this
    }
  }

  has(selector: Selector | String): boolean {
    return this.selectors.has(selector.toString())
  }

  get(selector: Selector | string): Selector | undefined {
    return this.selectors.get(selector.toString())
  }

  toArray(): Selector[] {
    return Array.from(this)
  }

  @memoize
  toString(): string {
    return this.toArray().join(", ")
  }
}