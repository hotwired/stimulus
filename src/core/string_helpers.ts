export function camelize(value: string) {
  return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase())
}

export function namespaceCamelize(value: string) {
  return camelize(value.replace(/--/g, "-").replace(/__/g, "_"))
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function dasherize(value: string) {
  return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`)
}

export function tokenize(value: string) {
  return value.match(/[^\s]+/g) || []
}
