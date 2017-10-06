export function on(eventName: string, eventTarget?: EventTarget) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    inject(target, "initialize", function() {
      this.addAction(`${eventName}->${this.identifier}#${propertyKey}`, eventTarget)
    })
  }
}

function inject(target, methodName, fn) {
  const method = target[methodName]
  target[methodName] = function() {
    fn.apply(this, arguments)
    method.apply(this, arguments)
  }
}
