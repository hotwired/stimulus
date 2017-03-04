export class ActionString {
  private tokens: Array<string>
  private tagName: string

  constructor(value: string, tagName: string) {
    this.tokens = value.split("->")
    this.tagName = tagName.toLowerCase()
  }

  get eventName(): string {
    if (this.tokens.length > 1) {
      return this.tokens[0]
    } else {
      return this.getEventName()
    }
  }

  get methodName(): string {
    return this.tokens[this.tokens.length -  1]
  }

  private elementEventNames = {
    form: "submit"
  }

  private getEventName(): string {
    return this.elementEventNames[this.tagName] || "click"
  }
}