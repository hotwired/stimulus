export interface ClassDescriptor {
  identifier: string | null
  name: string
  className: string
}

const descriptorPattern = /(([^.=]+)\.)?([^:]+):(.+)/

export function parseClassDescriptorStringForIdentifier(descriptorString: string, matchingIdentifier: string) {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern)
  if (matches) {
    const [, , identifier, name, className] = Array.from(matches)
    if (identifier == matchingIdentifier || identifier == null) {
      return { identifier, name, className }
    }
  }
}
