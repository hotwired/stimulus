export interface Configuration {
  rootElement: Element
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
}

export interface ConfigurationOptions {
  rootElement?: Element
  controllerAttribute?: string
  actionAttribute?: string
  targetAttribute?: string
}

export const defaultConfiguration: Configuration = {
  rootElement: document.documentElement,
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target"
}

export function createConfiguration(configuration: ConfigurationOptions): Configuration {
  return Object.assign({}, defaultConfiguration, configuration)
}
