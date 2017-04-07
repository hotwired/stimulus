let enabled = false

export class Logger {
  private tags: Array<any>

  static enable() {
    enabled = true
  }

  static disable() {
    enabled = false
  }

  static create(...tags): Logger {
    return new Logger(tags)
  }

  constructor(tags: Array<any> = []) {
    this.tags = tags
  }

  tag(...tags) {
    return new Logger(this.tags.concat(tags))
  }

  log(...messages) {
    if (enabled) {
      console.log.apply(this, this.formattedTags.concat(messages))
    }
  }

  private get formattedTags() {
    return ["Stimulus"].concat(this.tags).map(tag => `[${tag}]`)
  }
}
