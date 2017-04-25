let enabled = false

export class Logger {
  private tags: any[]

  static enable() {
    enabled = true
  }

  static disable() {
    enabled = false
  }

  static create(...tags): Logger {
    return new Logger(tags)
  }

  constructor(tags: any[] = []) {
    this.tags = tags
  }

  tag(...tags) {
    return new Logger(this.tags.concat(tags))
  }

  log(...messages) {
    if (enabled) {
      console.log.apply(console, this.buildFormatArguments(messages))
    }
  }

  private buildFormatArguments(messages: any[]) {
    const formatStrings: any[] = [], formatValues: any[] = []
    for (const message of this.formattedTags.concat(messages)) {
      const type = typeof message
      if (type == "string" || type == "number" || type == "boolean") {
        formatStrings.push("%s")
      } else {
        formatStrings.push("%o")
      }
      formatValues.push(message)
    }
    return [formatStrings.join(" "), ...formatValues]
  }

  private get formattedTags() {
    return ["Stimulus"].concat(this.tags).map(tag => `[${tag}]`)
  }
}
