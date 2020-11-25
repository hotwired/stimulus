export interface ActionDescriptor {
  eventTarget: EventTarget
  eventOptions: AddEventListenerOptions
  eventName: string
  identifier: string
  methodName: string
}

// capture nos.:            12   23 4               43 5        51 6   67 8      879 X  X9
const descriptorPattern = /^((.+?)(@(window|document))?(->|-&gt;))?(.+?)(#([^:]+?))(:(.+))?$/

export function parseDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  return {
    eventTarget:  parseEventTarget(matches[4]),
    eventName:    matches[2],
    eventOptions: matches[10] ? parseEventOptions(matches[10]) : {},
    identifier:   matches[6],
    methodName:   matches[8]
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
