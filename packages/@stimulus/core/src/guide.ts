import { Logger } from "./logger"

export class Guide {
  readonly logger: Logger
  readonly warnedKeysByObject: WeakMap<any, Set<string>> = new WeakMap

  constructor(logger: Logger) {
    this.logger = logger
  }

  warn(object: any, key: string, message: string) {
    let warnedKeys: Set<string> | undefined = this.warnedKeysByObject.get(object)

    if (!warnedKeys) {
      warnedKeys = new Set
      this.warnedKeysByObject.set(object, warnedKeys)
    }

    if (!warnedKeys.has(key)) {
      warnedKeys.add(key)
      this.logger.warn(message, object)
    }
  }
}
