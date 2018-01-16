import { Controller } from "stimulus"

export type ActionLogEntry = {
  name: string
  eventType: string
  eventTarget: EventTarget
  defaultPrevented: boolean
}

export class LogController extends Controller {
  initializeCount = 0
  connectCount = 0
  disconnectCount = 0
  actionLog: ActionLogEntry[] = []

  initialize() {
    this.initializeCount++
  }

  connect() {
    this.connectCount++
  }

  disconnect() {
    this.disconnectCount++
  }

  log(event) {
    this.recordAction("log", event)
  }

  log2(event) {
    this.recordAction("log2", event)
  }

  private recordAction(name: string, event: Event) {
    const entry = { name, eventType: event.type, eventTarget: event.target, defaultPrevented: event.defaultPrevented }
    this.actionLog.push(entry)
  }
}
