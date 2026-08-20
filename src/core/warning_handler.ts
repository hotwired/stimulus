export interface WarningHandler {
  handleWarning(warning: string, message: string, detail: any): void
}
