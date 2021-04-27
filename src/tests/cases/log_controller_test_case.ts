import { ControllerTestCase } from "./controller_test_case"
import { LogController, ActionLogEntry, MutationLogEntry } from "../controllers/log_controller"
import { ControllerConstructor } from "../../core/controller"

export class LogControllerTestCase extends ControllerTestCase(LogController) {
  controllerConstructor!: ControllerConstructor & { actionLog: ActionLogEntry[], mutationLog: MutationLogEntry[] }

  async setup() {
    this.controllerConstructor.actionLog = []
    this.controllerConstructor.mutationLog = []
    await super.setup()
  }

  assertActions(...actions: any[]) {
    this.assert.equal(this.actionLog.length, actions.length)

    actions.forEach((expected, index) => {
      const keys = Object.keys(expected)
      const actual = slice(this.actionLog[index] || {}, keys)
      const result = keys.every(key => deepEqual(expected[key], actual[key]))
      this.assert.pushResult({ result, actual, expected, message: "" })
    })
  }

  assertNoActions() {
    this.assert.equal(this.actionLog.length, 0)
  }

  get actionLog(): ActionLogEntry[] {
    return this.controllerConstructor.actionLog
  }

  assertMutations(...mutations: any[]) {
    this.assert.equal(this.mutationLog.length, mutations.length)

    mutations.forEach((expected, index) => {
      const keys = Object.keys(expected)
      const actual = slice(this.mutationLog[index] || {}, keys)
      const result = keys.every(key => expected[key] === actual[key])
      this.assert.pushResult({ result, actual, expected, message: "" })
    })
  }

  assertNoMutations() {
    this.assert.equal(this.mutationLog.length, 0)
  }

  get mutationLog(): MutationLogEntry[] {
    return this.controllerConstructor.mutationLog
  }
}

function slice(object: any, keys: string[]): any {
  return keys.reduce((result: any, key: string) => (result[key] = object[key], result), {})
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true
  } else {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) { return false }
    for (var prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) {
        return false
      }
    }
    return true
  }
}
