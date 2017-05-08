import { ActionOptions } from "./context"

export function on(eventName: string, actionOptionsOrEventTarget?: ActionOptions | EventTarget) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    inject(target, "initialize", function() {
      this.addAction(`${eventName}->${this.identifier}#${propertyKey}`, actionOptionsOrEventTarget)
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
