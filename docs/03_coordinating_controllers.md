# Coordinating Controllers

COVERS: Multiple controllers, findAll, colocating, nesting

* So far we've just seen a single controller on the page at a time
* The controllers we've built are reusable
* Any time we want to provide a way to copy a bit of text to the clipboard, all we need is markup on the page with the right annotations
* Let's go ahead and add another one to the page
* Copy and paste the markup, then change the URL in the `value` attribute:

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" class="copy-to-clipboard__input" type="text" value="https://stimulusjs.org/">
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

* (Demonstrate)
* (Explain that these are two separate controller instances)
* Now let's add one more. This time we'll use a link instead of a button:

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" class="copy-to-clipboard__input" type="text" value="https://rubyonrails.org/">
  <a href="#" data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

* (Demonstrate)
* We can use any kind of element we want as the trigger, as long as it has the `data-action` attribute on it
* We could even have multiple elements with the same action

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
