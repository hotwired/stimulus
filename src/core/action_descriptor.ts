export interface ActionDescriptor {
  eventTarget: EventTarget
  eventOptions: AddEventListenerOptions
  eventName: string
  identifier: string
  methodName: string
  keyFilter: string
}

// capture nos.:            12   23 4               43 5  6                  65   1 7   78 9      981011 1110
const descriptorPattern = /^((.+?)(@(window|document))?(\.(up|down|left|right))?->)?(.+?)(#([^:]+?))(:(.+))?$/

export function parseActionDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  return {
    eventTarget:  parseEventTarget(matches[4]),
    eventName:    matches[2],
    eventOptions: matches[11] ? parseEventOptions(matches[11]) : {},
    identifier:   matches[7],
    methodName:   matches[9],
    keyFilter: matches[6]
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
