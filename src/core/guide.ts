import { WarningHandler } from "./warning_handler"

export class Guide {
  readonly warningHandler: WarningHandler
  readonly warnedKeysByObject: WeakMap<any, Set<string>> = new WeakMap()

  constructor(warningHandler: WarningHandler) {
    this.warningHandler = warningHandler
  }

  warn(object: any, key: string, warning: string, message: string) {
    let warnedKeys: Set<string> | undefined = this.warnedKeysByObject.get(object)

    if (!warnedKeys) {
      warnedKeys = new Set()
      this.warnedKeysByObject.set(object, warnedKeys)
    }

    if (!warnedKeys.has(key)) {
      warnedKeys.add(key)
      this.warningHandler.handleWarning(warning, message, object)
    }
  }
}
