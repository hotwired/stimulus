import "core-js/es/array/find"
import "core-js/es/array/find-index"
import "core-js/es/array/from"
import "core-js/es/map"
import "core-js/es/object/assign"
import "core-js/es/promise"
import "core-js/es/set"
import "core-js/es/string/starts-with"
import "element-closest"
import "mutation-observer-inner-html-shim"
import "eventlistener-polyfill"

if (typeof SVGElement.prototype.contains != "function") {
  SVGElement.prototype.contains = function(node) {
    return this === node || this.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY
  }
}

// From https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected#polyfill
if (!("isConnected" in Node.prototype)) {
  Object.defineProperty(Node.prototype, "isConnected", {
    get() {
      return (
        !this.ownerDocument ||
        !(
          this.ownerDocument.compareDocumentPosition(this) &
          this.DOCUMENT_POSITION_DISCONNECTED
        )
      )
    }
  })
}
