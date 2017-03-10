import { Action } from "./action"
import { Multimap2 } from "./multimap"

type EventName = string
type ActionIndex = Multimap2<EventTarget, EventName, Action>

export class ActionSet {
  values: Set<Action>
  actionsByCurrentTarget: Multimap2<EventTarget, EventName, Action>
  actionsByEventTarget: Multimap2<EventTarget, EventName, Action>

  constructor() {
    this.values = new Set<Action>()
    this.actionsByCurrentTarget = new Multimap2<EventTarget, EventName, Action>()
    this.actionsByEventTarget = new Multimap2<EventTarget, EventName, Action>()
  }

  get actions(): Action[] {
    return Array.from(this.values)
  }

  add(action: Action) {
    if (!this.values.has(action)) {
      this.values.add(action)
      this.actionsByCurrentTarget.add(action.currentTarget, action.eventName, action)
      this.actionsByEventTarget.add(action.eventTarget, action.eventName, action)
    }
  }

  delete(action: Action) {
    if (this.values.has(action)) {
      this.values.delete(action)
      this.actionsByCurrentTarget.delete(action.currentTarget, action.eventName, action)
      this.actionsByEventTarget.delete(action.eventTarget, action.eventName, action)
    }
  }

  has(action: Action): boolean {
    return this.values.has(action)
  }

  getActionsForCurrentTargetAndEventName(currentTarget: EventTarget, eventName: EventName): Action[] {
    return this.actionsByCurrentTarget.get(currentTarget, eventName)
  }

  getActionsForEventTargetAndEventName(eventTarget: EventTarget, eventName: EventName): Action[] {
    return this.actionsByEventTarget.get(eventTarget, eventName)
  }
}
