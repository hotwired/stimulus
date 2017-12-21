# Building Something Real

* Logging hello to the console isn't very exciting
* Let's build something we might actually use
* We'll go over a real example from Basecamp

## Encapsulating the DOM Clipboard API

* We have various bits of data in Basecamp, like URLs, that we want to be able to copy to the clipboard with one click
* The web platform now has an API for this that is supported across all the current major browsers
* If a text input field has a selection, you can call `document.execCommand("copy")` to copy the selected text
* Let's implement a Stimulus controller that uses a hidden text input field to copy a value
* It should look like a button:

[screenshot]

* We'll start with basic HTML:

```html
<div>
  <input type="text" value="https://basecamp.com/">
  <button>Copy to Clipboard</button>
</div>
```

* Next, create `src/controllers/clipboard_controller.js` and add an empty method `copy`:

```js
// src/controllers/clipboard_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  copy() {
  }
}
```

## Connecting the Controller

* Now we can wire up the controller to our markup
* Add `data-controller="clipboard"` to the outer `<div>`. Any time this attribute appears on an element, Stimulus will connect our controller
* Add `data-target="clipboard.source"` to the text field so that we can refer to it by the logical name `source`
* Add `data-action="clipboard#copy"` to the button so clicking it calls the `copy` method

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" type="text" value="https://basecamp.com/">
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

### Common Actions Have a Shorthand Notation

* (Describe why we can omit `click->` from the `data-action` attribute)

## Implementing the Copy Action

* Now we can implement the `copy` action:

```js
// src/controllers/clipboard_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  copy() {
    this.sourceElement.select()
    document.execCommand("copy")
  }

  get sourceElement() {
    return this.targets.find("source")
  }
}
```

* (Demonstrate the functionality)

## Hiding the Implementation Details

* The last thing we'd like to do is hide the input field
* We'll do this with CSS
* Start by adding `class="clipboard-source"` to the input field:

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" class="clipboard-source" type="text" value="https://basecamp.com/">
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

* Then add the following style to `public/css/main.css`:

```css
.clipboard-source {
  display: none;
}
```

* (Demonstrate that the input field is invisible now)

## Understanding Progressive Enhancement

* What if the browser doesn't support the copy API?
* What if JavaScript failed to load due to a CDN issue? What if it's disabled entirely?
* We can account for these cases using progressive enhancement techniques
* We'll _feature-test_ support for the API
* If it's supported, we'll add a class name to the element
* Then we'll condition our behavioral CSS to require that class

* (Example)
* (Demonstrate by commenting out the script tag)

## Stimulus Controllers are Reusable

* So far we've just seen a single controller on the page at a time
* The controllers we've built are reusable
* Any time we want to provide a way to copy a bit of text to the clipboard, all we need is markup on the page with the right annotations
* Let's go ahead and add another one to the page
* Copy and paste the markup, then change the URL in the `value` attribute:

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" class="clipboard-source" type="text" value="https://stimulusjs.org/">
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

* (Demonstrate)

## Each Controller Instance is a Unique Object

* (Explain that these are two separate controller instances)

## Actions and Targets Can Go on Any Kind of Element

* Now let's add one more. This time we'll use a link instead of a button:

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" class="clipboard-source" type="text" value="https://rubyonrails.org/">
  <a href="#" data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

* (Demonstrate)
* We can use any kind of element we want as the trigger, as long as it has the `data-action` attribute on it
* We could even have multiple elements with the same action
