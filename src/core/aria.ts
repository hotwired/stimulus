type ValueOf<T> = T[keyof T]

export const ariaMapping = {
  "aria-activedescendant": "ariaActiveDescendant",
  "aria-details": "ariaDetails",
  "aria-errormessage": "ariaErrorMessage",
  "aria-controls": "ariaControls",
  "aria-describedby": "ariaDescribedBy",
  "aria-flowto": "ariaFlowTo",
  "aria-labelledby": "ariaLabelledBy",
  "aria-owns": "ariaOwns",
} as const

export type AriaAttributeName = keyof typeof ariaMapping
export type AriaPropertyName = ValueOf<typeof ariaMapping>

export function isAriaAttributeName(attributeName: string): attributeName is AriaAttributeName {
  return attributeName in ariaMapping
}

export function forEachAriaMapping(callback: (attribute: AriaAttributeName, property: AriaPropertyName) => void) {
  for (const [attribute, property] of Object.entries(ariaMapping)) {
    callback(attribute as AriaAttributeName, property as AriaPropertyName)
  }
}
