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
  keyFilter: string
}

// capture nos.:                  1      1    2   2     3   3      4               4      5   5    6      6     7  7
const descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/

export function parseActionDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  let eventName = matches[2]
  let keyFilter = matches[3]

  if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
    eventName += `.${keyFilter}`
    keyFilter = ""
  }

  return {
    eventTarget: parseEventTarget(matches[4]),
    eventName,
    eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
    identifier: matches[5],
    methodName: matches[6],
    keyFilter: matches[1] || keyFilter,
  }
}

function parseEventTarget(eventTargetName: string): EventTarget | undefined {
  if (eventTargetName == "window") {
    return window
  } else if (eventTargetName == "document") {
    return document
  }
}

function parseEventOptions(eventOptions: string): AddEventListenerOptions {
  return eventOptions
    .split(":")
    .reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {})
}

export function stringifyEventTarget(eventTarget: EventTarget) {
  if (eventTarget == window) {
    return "window"
  } else if (eventTarget == document) {
    return "document"
  }
}
