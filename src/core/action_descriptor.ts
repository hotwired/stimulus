import type { Controller } from "./controller"

export type ActionDescriptorFilters = Record<string, ActionDescriptorFilter>
export type ActionDescriptorFilter = (options: ActionDescriptorFilterOptions) => boolean
type ActionDescriptorFilterOptions = {
  name: string
  value: boolean
  event: Event
  element: Element
  controller: Controller<Element>
}

enum GlobalTargets {
  window = "window",
  document = "document",
  outside = "outside",
}

type GlobalTargetValues = null | keyof typeof GlobalTargets

export const defaultActionDescriptorFilters: ActionDescriptorFilters = {
  stop({ event, value }) {
    if (value) event.stopPropagation()

    return true
  },

  prevent({ event, value }) {
    if (value) event.preventDefault()

    return true
  },

  self({ event, value, element }) {
    if (value) {
      return element === event.target
    } else {
      return true
    }
  },
}

export interface ActionDescriptor {
  eventTarget: EventTarget
  eventOptions: AddEventListenerOptions
  eventName: string
  identifier: string
  methodName: string
  globalFilter: string
  keyFilter: string
}

// See capture number groups in the comment below.
const descriptorPattern =
  //      1      1    2   2     3   3      4                       4      5   5    6      6     7  7
  /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document|outside))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/

export function parseActionDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  const globalTargetName = (matches[4] || null) as GlobalTargetValues

  let eventName = matches[2]
  let keyFilter = matches[3]

  if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
    eventName += `.${keyFilter}`
    keyFilter = ""
  }

  return {
    eventTarget: parseEventTarget(globalTargetName),
    eventName,
    eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
    identifier: matches[5],
    methodName: matches[6],
    globalFilter: globalTargetName === GlobalTargets.outside ? GlobalTargets.outside : "",
    keyFilter: matches[1] || keyFilter,
  }
}

function parseEventTarget(globalTargetName?: GlobalTargetValues): EventTarget | undefined {
  if (globalTargetName == GlobalTargets.window) {
    return window
  } else if (globalTargetName == GlobalTargets.document || globalTargetName === GlobalTargets.outside) {
    return document
  }
}

function parseEventOptions(eventOptions: string): AddEventListenerOptions {
  return eventOptions
    .split(":")
    .reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {})
}

export function stringifyEventTarget(eventTarget: EventTarget, globalFilter: string): string | undefined {
  if (eventTarget == window) {
    return GlobalTargets.window
  } else if (eventTarget == document) {
    return globalFilter === GlobalTargets.outside ? GlobalTargets.outside : GlobalTargets.document
  }
}
