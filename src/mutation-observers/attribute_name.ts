const htmlDocuments = new WeakMap<Document, boolean>()

// Whether `observedName`, as reported by MutationRecord#attributeName or Element#attributes, is the attribute that
// getAttribute(name) reads: HTML elements in HTML documents fold ASCII uppercase letters, other elements keep the case.
export function attributeNameMatches(element: Element, name: string, observedName: string) {
  if (observedName == name) {
    return true
  } else if (observedName.length == name.length && foldsAttributeNames(element)) {
    return observedName == lowercaseASCII(name)
  } else {
    return false
  }
}

export function foldsAttributeNames(element: Element) {
  return element.namespaceURI == "http://www.w3.org/1999/xhtml" && isHTMLDocument(element.ownerDocument)
}

export function lowercaseASCII(name: string) {
  return name.replace(/[A-Z]+/g, (letters) => letters.toLowerCase())
}

function isHTMLDocument(document: Document) {
  let result = htmlDocuments.get(document)
  if (result === undefined) {
    result = document.createElement("A").localName == "a"
    htmlDocuments.set(document, result)
  }
  return result
}
