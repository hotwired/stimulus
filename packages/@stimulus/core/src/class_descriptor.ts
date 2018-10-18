export interface ClassDescriptor {
  identifier: string
  name: string
  className: string
}

const descriptorPattern = /([^.=]+)\.([^=]+)=(.+)/

export function parseDescriptorString(descriptorString: string) {
  const source = descriptorString.trim()
  const matches = source.match(descriptorPattern)
  if (matches) {
    const [, identifier, name, className] = Array.from(matches)
    return { identifier, name, className }
  }
}
