export enum LogLevel {
  NONE,
  ERROR,
  WARN,
  INFO,
  DEBUG
}

export class Logger {
  level: LogLevel
  console: Console

  constructor(level: LogLevel = LogLevel.WARN, console = window.console) {
    this.level = level
    this.console = console
  }

  debug(...args) {
    if (this.level >= LogLevel.DEBUG) {
      this.console.log.apply(this.console, this.formatArgs(args))
    }
  }

  info(...args) {
    if (this.level >= LogLevel.INFO) {
      this.console.log.apply(this.console, this.formatArgs(args))
    }
  }

  warn(...args) {
    if (this.level >= LogLevel.WARN) {
      this.console.warn.apply(this.console, this.formatArgs(args))
    }
  }

  error(...args) {
    if (this.level >= LogLevel.ERROR) {
      this.console.error.apply(this.console, this.formatArgs(args))
    }
  }

  private formatArgs(args: any[]): any[] {
    const formatStrings: any[] = [], formatValues: any[] = []

    for (const arg of [this.loggerTag, ...args]) {
      const type = typeof arg
      if (type == "string" || type == "number" || type == "boolean") {
        formatStrings.push("%s")
      } else if (arg instanceof Node) {
        formatStrings.push("%o")
      } else {
        formatStrings.push("%O")
      }
      formatValues.push(arg)
    }

    return [formatStrings.join(" "), ...formatValues]
  }

  private get loggerTag(): string {
    return "[STIMULUS]"
  }
}
