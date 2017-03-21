import { ActionOptions } from "./controller"

export function on(eventName: string, actionOptions?: ActionOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const { connect } = target
    target.connect = function() {
      this.addAction(`${eventName}->${propertyKey}`, actionOptions)
      connect.apply(this, arguments)
    }
  }
}
