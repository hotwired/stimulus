import { Action } from "./action"
import { Multimap } from "@stimulus/multimap"

export class ActionSet {
  private actionsByEventName: Multimap<string, Action>

  constructor() {
    this.actionsByEventName = new Multimap<string, Action>()
  }

  get actions(): Action[] {
    return this.actionsByEventName.values
  }

  add(action: Action) {
    this.actionsByEventName.add(action.eventName, action)
  }

  delete(action: Action) {
    this.actionsByEventName.delete(action.eventName, action)
  }

  has(action: Action): boolean {
    return this.actionsByEventName.hasValue(action)
  }

  getActionsForEventName(eventName: string): Action[] {
    return this.actionsByEventName.getValuesForKey(eventName)
  }
}
