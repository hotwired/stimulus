export interface Schema {
  controllerAttribute: string
  actionAttribute: string
  targetAttribute: string
  targetAttributeForScope(identifier: string): string
  outletAttributeForScope(identifier: string, outlet: string): string
  keyMappings: {[key: string]: string}
}

export const defaultSchema: Schema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  targetAttributeForScope: (identifier) => `data-${identifier}-target`,
  outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
  keyMappings: {
    "enter": "Enter",
    "tab":   "Tab",
    "esc":   "Escape",
    "space": " ",
    "up":    "ArrowUp",
    "down":  "ArrowDown",
    "left":  "ArrowLeft",
    "right": "ArrowRight",
    "home":  "Home",
    "end":   "End"
  }
}
