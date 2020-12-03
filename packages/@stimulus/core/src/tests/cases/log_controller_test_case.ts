import { ControllerTestCase } from "./controller_test_case"
import { LogController, ActionLogEntry } from "../controllers/log_controller"
import { ControllerConstructor } from "../.."

export class LogControllerTestCase extends ControllerTestCase(LogController) {
  controllerConstructor!: ControllerConstructor & { actionLog: ActionLogEntry[] }

  async setup() {
    this.controllerConstructor.actionLog = []
    await super.setup()
  }

  assertActions(...actions: any[]) {
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
    return this.controllerConstructor.actionLog
  }
}

function slice(object: any, keys: string[]): any {
  return keys.reduce((result: any, key: string) => (result[key] = object[key], result), {})
}
