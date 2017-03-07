import { Action } from "./action"

export class ActionSet {
  actionsByEventTarget: Map<EventTarget, Set<Action>>
  actionsByEventName: Map<string, Set<Action>>

  constructor() {
    this.actionsByEventTarget = new Map<EventTarget, Set<Action>>()
    this.actionsByEventName = new Map<string, Set<Action>>()
  }

  get actions(): Action[] {
    const sets = Array.from(this.actionsByEventTarget.values())
    return sets.reduce((result, actions) => result.concat(Array.from(actions)), <Action[]> [])
  }

  add(action: Action) {
    const {eventTarget, eventName} = action
    add(this.actionsByEventTarget, eventTarget, action)
    add(this.actionsByEventName, eventName, action)
  }

  delete(action: Action) {
    const {eventTarget, eventName} = action
    del(this.actionsByEventTarget, eventTarget, action)
    del(this.actionsByEventName, eventName, action)
  }

  has(action: Action) {
    const actions = this.actionsByEventTarget.get(action.eventTarget)
    return actions != null && actions.has(action)
  }

  getActionsForEventTarget(eventTarget: EventTarget): Action[] {
    const actions = this.actionsByEventTarget.get(eventTarget)
    if (actions) {
      return Array.from(actions)
    }
    return []
  }

  hasActionsForEventTarget(eventTarget: EventTarget): boolean {
    const actions = this.actionsByEventTarget.get(eventTarget)
    return actions != null && actions.size > 0
  }

  getActionsForEventName(eventName: string): Action[] {
    const actions = this.actionsByEventName.get(eventName)
    if (actions) {
      return Array.from(actions)
    }
    return []
  }

  hasActionsForEventName(eventName: string): boolean {
    const actions = this.actionsByEventName.get(eventName)
    return actions != null && actions.size > 0
  }

  getActionsForEventNameAndEventTarget(eventName: string, eventTarget: EventTarget): Action[] {
    return this.getActionsForEventName(eventName).filter((action) => action.eventTarget === eventTarget)
  }
}

function add<T>(map: Map<T, Set<Action>>, key: T, value: Action) {
  fetch(map, key).add(value)
}

function del<T>(map: Map<T, Set<Action>>, key: T, value: Action) {
  fetch(map, key).delete(value)
  prune(map, key)
}

function fetch<T>(map: Map<T, Set<Action>>, key: T): Set<Action> {
  let actions = map.get(key)
  if (!actions) {
    actions = new Set<Action>()
    map.set(key, actions)
  }
  return actions
}

function prune<T>(map: Map<T, Set<Action>>, key: T) {
  const actions = map.get(key)
  if (actions != null && actions.size == 0) {
    map.delete(key)
  }
}
