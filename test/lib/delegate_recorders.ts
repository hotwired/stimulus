import {
  AttributeObserver,
  AttributeObserverDelegate,
  TokenListObserver,
  TokenListObserverDelegate
} from "sentinella"

export class Recorder {
  entries: Array<object>

  constructor() {
    this.reset()
  }

  get lastEntry() {
    return this.entries[this.entries.length - 1]
  }

  record(methodName: string, args: Array<any>) {
    const entry = {}
    entry[methodName] = args
    this.entries.push(entry)
  }

  reset() {
    this.entries = new Array
  }
}

export class AttributeObserverRecorder extends Recorder implements AttributeObserverDelegate {
  elementMatchedAttribute(...args) {
    this.record("elementMatchedAttribute", args)
  }

  elementAttributeValueChanged(...args) {
    this.record("elementAttributeValueChanged", args)
  }

  elementUnmatchedAttribute(...args) {
    this.record("elementUnmatchedAttribute", args)
  }
}

export class TokenListObserverRecorder extends Recorder implements TokenListObserverDelegate {
  elementMatchedTokenForAttribute(...args) {
    this.record("elementMatchedTokenForAttribute", args)
  }

  elementUnmatchedTokenForAttribute(...args) {
    this.record("elementUnmatchedTokenForAttribute", args)
  }
}
