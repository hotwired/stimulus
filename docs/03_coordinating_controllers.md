# Coordinating Controllers

COVERS: Multiple controllers, findAll, colocating, nesting

* Now let's look at other ways controllers can be combined on the page
* We'll build a controller that wraps up a common front-end pattern: toggling the expanded or collapsed state of an element
* We'll do this by annotating child elements that should be visible or hidden depending on whether the element is in a collapsed or expanded state
* For example, we might want to hide a form behind a button:

```html
<div data-controller="expandable">
  <button data-target="expandable.collapsed" data-action="expandable#toggle">Add a comment...</button>
  <form data-target="expandable.expanded">
    <textarea></textarea>
    <input type="submit" value="Add this comment">
    <input data-action="expandable#toggle" type="reset" value="Nevermind">
  </form>
</div>
```

* We'll write a controller whose `toggle` action toggles visibility of the collapsed or expanded targets:

```js
// src/controllers/expander_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  toggle() {
    this.isExpanded ? this.collapse() : this.expand()
  }
}
```

* Now we'll design the behavioral styles for the expanded and collapsed states:

```css
[data-controller~="expander"][data-expander-expanded] > [data-target~="expander.collapsed"] {
  display: none;
}

[data-controller~="expander"]:not([data-expander-expanded]) > [data-target~="expander.expanded"] {
  display: none;
}
```

* To toggle the target elements we need to add or remove a `data-expander-expanded` attribute
* We'll do that using the built-in data API
* The data API reads and writes DOM data attibutes and automatically prefixes them with the controller's identifier
* Let's implement the missing controller methods:

```js
export default class extends Controller {
  toggle() {
    this.isExpanded ? this.collapse() : this.expand()
  }

  expand() {
    this.data.set("expanded", true)
  }

  collapse() {
    this.data.delete("expanded")
  }

  get isExpanded() {
    return this.data.has("expanded")
  }
}
```

* The `expand` method writes a `data-expander-expanded` attribute on the element, the `collapse` method removes it, and the `isExpanded` getter checks for its presence

* (Demonstrate)
* (Explain reflecting initial state during rendering)
* (Explain nesting by putting an expandable inside an expandable)
* (Explain colocating by making a clipboard element expandable)
