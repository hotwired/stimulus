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
  </form>
</div>
```

* We'll write a controller whose `toggle` action toggles visibility of the collapsed or expanded targets:

```js
import { Controller } from "stimulus"

export default class ExpandableController extends Controller {
  toggle() {
    if (this.isExpanded) {
      this.collapse()
    } else {
      this.expand()
    }
  }
}
```

* Now we'll design the behavioral styles for the expanded and collapsed states
* Our base styles assume the expandable is in the collapsed state, so we'll hide the expanded targets:

```css
[data-target~="expandable.expanded"] {
  display: none;
}
```

* When the expandable is in the expanded state, each target element will have an `expanded` class, so we'll hide the collapsed targets and show the expanded targets:

```css
[data-target=~"expandable.collapsed"] {
  display: none;
}

[data-target=~"expandable.expanded"].expanded {
  display: initial;
}
```

* With the CSS in place, we can now implement the missing controller methods
* The `expand` and `collapse` methods just add or remove the `expanded` class on our target elements

```js
  expand() {
    this.allTargets.forEach(target => target.classList.add("expanded"))
  }

  collapse() {
    this.allTargets.forEach(target => target.classList.remove("expanded"))
  }
```

* The `isExpanded` computed property will return `true` if all targets have the `expanded` class name

```js
   get isExpanded() {
     return this.allTargets.all(target => target.classList.contains("expanded"))
   }
```

* Finally, the `allTargets` getter will return an array of all target elements

```js
   get allTargets() {
     return this.targets.findAll("expanded", "collapsed")
   }
```

(TODO: Make findAll work with multiple arguments)

* (Demonstrate)
* (Explain reflecting initial state during rendering)
* (Explain nesting by putting an expandable inside an expandable)
* (Explain colocating by making a clipboard element expandable)
