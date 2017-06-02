const {prototype} = Element
const matches = prototype.matches || prototype.webkitMatchesSelector || prototype.msMatchesSelector

export function elementMatchesSelector(element: Element, selector: string): boolean {
  return matches.call(element, selector)
}
