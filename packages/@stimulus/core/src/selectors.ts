declare var CSS: {
  escape(string: string): string
}

export function attributeValueContainsToken(attributeName: string, token: string) {
  return `[${CSS.escape(attributeName)}~="${CSS.escape(token)}"]`
}
