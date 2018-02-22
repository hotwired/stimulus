export interface ActionDescriptor {
  eventTarget: EventTarget
  eventName: string
  identifier: string
  methodName: string
}

// capture nos.:            12   23 4               43   1 5   56 7  76
const descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#(.+))?$/

export function parseDescriptorString(descriptorString: string): Partial<ActionDescriptor> {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern) || []
  return {
    eventTarget: parseEventTarget(matches[4]),
    eventName:   matches[2],
    identifier:  matches[5],
    methodName:  matches[7]
  }
}

function parseEventTarget(eventTargetName: string): EventTarget | undefined {
  if (eventTargetName == "window") {
    return window
  } else if (eventTargetName == "document") {
    return document
  }
}

export function stringifyEventTarget(eventTarget: EventTarget) {
  if (eventTarget == window) {
    return "window"
  } else if (eventTarget == document) {
    return "document"
  }
}
