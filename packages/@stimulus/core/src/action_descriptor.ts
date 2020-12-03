export interface ActionDescriptor {
  eventTarget: EventTarget
  eventOptions: AddEventListenerOptions
  eventName: string
  identifier: string
  methodName: string
}

// capture nos.:            12   23 4               43   1 5   56 7      768 9  98
const descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/

export function parseActionDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  return {
    eventTarget:  parseEventTarget(matches[4]),
    eventName:    matches[2],
    eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
    identifier:   matches[5],
    methodName:   matches[7]
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
