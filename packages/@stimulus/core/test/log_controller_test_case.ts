import { ControllerTestCase } from "./controller_test_case"
import { LogController, ActionLogEntry } from "./log_controller"

export class LogControllerTestCase extends ControllerTestCase<LogController> {
  controllerConstructor = LogController

  async setup() {
    LogController.actionLog = []
    await super.setup()
  }

  assertActions(...actions) {
    this.assert.equal(this.actionLog.length, actions.length)

    actions.forEach((expected, index) => {
      const keys = Object.keys(expected)
      const actual = slice(this.actionLog[index] || {}, keys)
      const result = keys.every(key => expected[key] === actual[key])
      this.assert.pushResult({ result, actual, expected, message: "" })
    })
  }

  assertNoActions() {
    this.assert.equal(this.actionLog.length, 0)
  }

  get actionLog(): ActionLogEntry[] {
    return LogController.actionLog
  }
}

function slice(object: object, keys: string[]) {
  return keys.reduce((result, key) => (result[key] = object[key], result), {})
}
