import { ControllerTestCase } from "@stimulus/test"
import { LogController } from "./log_controller"

export class LogControllerTestCase extends ControllerTestCase<LogController> {
  controllerConstructor = LogController

  assertActions(...actions) {
    actions.forEach((expected, index) => {
      const keys = Object.keys(expected)
      const actual = slice(this.controller.actionLog[index] || {}, keys)
      this.assert.propEqual(actual, expected)
    })
  }
}

function slice(object: object, keys: string[]) {
  return keys.reduce((result, key) => (result[key] = object[key], result), {})
}
