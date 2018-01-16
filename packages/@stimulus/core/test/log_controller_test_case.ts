import { Controller } from "@stimulus/core"
import { ControllerTestCase } from "@stimulus/test"
import { LogController } from "./log_controller"

export class LogControllerTestCase extends ControllerTestCase<LogController> {
  controllerConstructor = LogController

  assertActions(controller, ...actions) {
    if (!(controller instanceof Controller)) {
      actions.unshift(controller)
      controller = this.controller
    }

    const actionLog = controller.actionLog
    this.assert.equal(actionLog.length, actions.length)

    actions.forEach((expected, index) => {
      const keys = Object.keys(expected)
      const actual = slice(controller.actionLog[index] || {}, keys)
      this.assert.propEqual(actual, expected)
    })
  }

  assertNoActions() {
    this.assert.equal(this.controller.actionLog.length, 0)
  }
}

function slice(object: object, keys: string[]) {
  return keys.reduce((result, key) => (result[key] = object[key], result), {})
}
