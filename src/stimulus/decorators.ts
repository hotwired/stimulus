import { ActionOptions } from "./controller"

export function on(eventName: string, actionOptions?: ActionOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const { initialize } = target
    target.initialize = function() {
      this.addAction(`${eventName}->${propertyKey}`, actionOptions)
      initialize.apply(this, arguments)
    }
  }
}
