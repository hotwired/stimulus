import { Action } from "./action"
import { Context } from "./context"

export class ActionSet {
  context: Context
  started: boolean
  actions: Set<Action>

  constructor(context: Context) {
    this.context = context
    this.started = false
    this.actions = new Set
  }

  start() {
    if (!this.started) {
      this.started = true
      this.connectActions()
    }
  }

  stop() {
    if (this.started) {
      this.disconnectActions()
      this.started = false
    }
  }

  add(action: Action) {
    if (!this.actions.has(action)) {
      action.connect()
      this.actions.add(action)
    }
  }

  delete(action: Action) {
    if (this.actions.has(action)) {
      this.actions.delete(action)
      action.disconnect()
    }
  }

  private connectActions() {
    this.actions.forEach(action => action.connect())
  }

  private disconnectActions() {
    this.actions.forEach(action => action.disconnect())
  }
}
