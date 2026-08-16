import { Controller } from "../../core/controller"
import { Multimap } from "../../multimap/multimap"

export class AriaController extends Controller {
  added = new Multimap<string, Element>()
  removed = new Multimap<string, Element>()

  ariaControlsElementConnected(element: Element) {
    this.added.add("aria-controls", element)
  }

  ariaDescribedByElementConnected(element: Element) {
    this.added.add("aria-describedby", element)
  }

  ariaControlsElementDisconnected(element: Element) {
    this.removed.add("aria-controls", element)
  }

  ariaDescribedByElementDisconnected(element: Element) {
    this.removed.add("aria-describedby", element)
  }

  ariaOwnsElementConnected(element: Element) {
    const { parentElement } = this.element

    if (parentElement) {
      const elementsWithId = parentElement.querySelectorAll("[id]")
      const ids = Array.from(elementsWithId).map((element) => element.id)

      this.element.setAttribute("aria-owns", ids.join(" "))
    }

    this.added.add("aria-owns", element)
  }
}
