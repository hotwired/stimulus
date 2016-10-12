export function log(message, ...args) {
  const specifier = "%s " + Array(args.length + 1).join("%o ")
  console.log(specifier, message, ...args)
}

export function trace(message, ...args) {
  log(message, ...args)
  console.trace()
}
