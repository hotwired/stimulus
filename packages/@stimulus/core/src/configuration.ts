import { LogLevel } from "./logger"

export interface Configuration {
  logLevel: LogLevel
  rootElement: Element
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
}

export type ConfigurationOptions = Element | {
  logLevel?: LogLevel
  rootElement?: Element
  controllerAttribute?: string
  actionAttribute?: string
  targetAttribute?: string
}

export const defaultConfiguration: Configuration = {
  logLevel: LogLevel.WARN,
  rootElement: document.documentElement,
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target"
}

export function createConfiguration(configuration: ConfigurationOptions): Configuration {
  if (configuration instanceof Element) {
    return createConfiguration({ rootElement: configuration })
  } else {
    return Object.assign({}, defaultConfiguration, configuration)
  }
}
