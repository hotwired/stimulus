export interface ActionDescriptor {
  eventTarget: EventTarget
  eventOptions: AddEventListenerOptions
  eventName: string
  identifier: string
  methodName: string
  keyFilter: string
}

// capture nos.:               1   1     2   2      3               3      4   4    5      5     6  6
const descriptorPattern = /^(?:(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/

export function parseActionDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  return {
    eventTarget:  parseEventTarget(matches[3]),
    eventName:    matches[1],
    eventOptions: matches[6] ? parseEventOptions(matches[6]) : {},
    identifier:   matches[4],
    methodName:   matches[5],
    keyFilter: matches[2]
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
  return eventOptions.split(":").reduce((options, token) =>
    Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) })
  , {})
}

export function stringifyEventTarget(eventTarget: EventTarget) {
  if (eventTarget == window) {
    return "window"
  } else if (eventTarget == document) {
    return "document"
  }
}
