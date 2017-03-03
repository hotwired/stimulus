export class Action {
  static parse(element: Element, value: string): Action {
    return new Action(element, "click", value)
  }

  element: Element
  eventName: string
  methodName: string

  constructor(element: Element, eventName: string, methodName: string) {
    this.element = element
    this.eventName = eventName
    this.methodName = methodName
  }

  isEqualTo(action: Action | undefined): boolean {
    if (action) {
      return action.element == this.element &&
        action.eventName == this.eventName &&
        action.methodName == this.methodName
    } else {
      return false
    }
  }
}