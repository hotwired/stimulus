import { ActionOptions } from "./controller"

export function on(eventName: string, actionOptions?: ActionOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    inject(target, "initialize", function() {
      this.addAction(`${eventName}->${propertyKey}`, actionOptions)
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
