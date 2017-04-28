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
        formatValues.push(arg)
      } else if (arg instanceof Node) {
        formatStrings.push("%o")
        formatValues.push(arg)
      } else if (arg instanceof LoggerTag) {
        formatStrings.push(arg.formatString)
        formatValues.push(...arg.formatValues)
      } else if (arg instanceof Error) {
        formatStrings.push("\n\n%o\n\n")
        formatValues.push(arg)
      } else {
        formatStrings.push("%O")
        formatValues.push(arg)
      }
    }

    return [formatStrings.join(" "), ...formatValues]
  }

  private get loggerTag(): LoggerTag {
    return new LoggerTag("STIMULUS")
  }
}

export class LoggerTag {
  name: string
  foregroundColor: string
  backgroundColor: string

  constructor(name: string, foregroundColor: string = "#fff", backgroundColor: string = "#aaa") {
    this.name = name
    this.foregroundColor = foregroundColor
    this.backgroundColor = backgroundColor
  }

  get formatString(): string {
    return `%c${escapeFormatting(this.name)}%c`
  }

  get formatValues(): string[] {
    return [this.formatValue, ""]
  }

  private get formatValue(): string {
    return `
      color: ${this.foregroundColor};
      background-color: ${this.backgroundColor};
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      padding: 1px 6px;
      font-weight: bold;
      font-family: sans-serif;
      font-size: x-small;
    `
  }
}

function escapeFormatting(value: string): string {
  return value.replace(/%/g, "%%")
}
