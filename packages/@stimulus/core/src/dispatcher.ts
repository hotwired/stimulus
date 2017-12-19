import { Action } from "./action"
import { Context } from "./context"

export class Dispatcher {
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
      this.addEventListeners()
    }
  }

  stop() {
    if (this.started) {
      this.removeEventListeners()
      this.started = false
    }
  }

  addAction(action: Action) {
    if (!this.actions.has(action)) {
      action.addEventListener()
      this.actions.add(action)
    }
  }

  removeAction(action: Action) {
    if (this.actions.has(action)) {
      this.actions.delete(action)
      action.removeEventListener()
    }
  }

  private addEventListeners() {
    this.actions.forEach(action => action.addEventListener())
  }

  private removeEventListeners() {
    this.actions.forEach(action => action.removeEventListener())
  }
}
