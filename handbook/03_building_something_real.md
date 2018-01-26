---
slug: /building-something-real
---

# Building Something Real

We've implemented our first controller and learned how Stimulus connects HTML to JavaScript. But logging "Hello" to the console isn't particularly exciting, nor is it representative of the kinds of things we're likely to build.

Let's take a look at something we can use in a real application by re-creating a controller from Basecamp.

## Encapsulating the DOM Clipboard API

Scattered throughout Basecamp's UI are buttons like these:

[img]

When you click one, Basecamp copies a bit of text, such as a URL or an email address, to your clipboard.

The web platform has [an API for accessing the system clipboard](https://www.w3.org/TR/clipboard-apis/) which is [well-supported in current browsers](https://caniuse.com/#feat=clipboard). But there's no HTML element that does what we need. To implement the Copy button, we must use JavaScript.

## Implementing a Copy Button

Let's say we have an app which allows us to grant someone else access by generating a PIN for them. It would be convenient if we could display that generated PIN alongside a button to copy it to the clipboard for easy sharing.

Open `public/index.html` and replace the contents of `<body>` with a rough sketch of the button:

```html
<div>
  PIN: <input type="text" value="1234" readonly>
  <button>Copy to Clipboard</button>
</div>
```

## Setting Up the Controller

Next, create `src/controllers/clipboard_controller.js` and add an empty method `copy`:

```js
// src/controllers/clipboard_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  copy() {
  }
}
```

Then add `data-controller="clipboard"` to the outer `<div>`. Any time this attribute appears on an element, Stimulus will connect an instance of our controller:

```html
<div data-controller="clipboard">
```

## Defining the Target

We'll need a reference to the text field so we can select its contents before invoking the clipboard API. Add `data-target="clipboard.source"` to the text field:

```html
  PIN: <input data-target="clipboard.source" type="text" value="1234" readonly>
```

Now add a target definition to the controller so we can access the text field element as `this.sourceTarget`:

```js
export default class extends Controller {
  static targets = [ "source" ]

  // ...
}
```

> ### What's With That `static targets` Line?
>
> When Stimulus loads your controller class, it looks for target name strings in a static array called `targets`. For each target name in the array, Stimulus adds three new properties to your controller. Here, our `"source"` target name becomes the following properties:
>
> * `this.sourceTarget` evaluates to the first `source` target in your controller's scope. If there is no `source` target, accessing the property throws an error.
> * `this.sourceTargets` evaluates to an array of all `source` targets in the controller's scope.
> * `this.hasSourceTarget` evaluates to `true` if there is a `source` target or `false` if not.


## Connecting the Action

Now we're ready to hook up the Copy button.

We want a click on the button to invoke the `copy` method in our controller, so we'll add `data-action="clipboard#copy"`:

```html
  <button data-action="clipboard#copy">Copy to Clipboard</button>
```

> ### Common Events Have a Shorthand Action Notation
>
> You might have noticed we've omitted `click->` from the action descriptor. That's because Stimulus defines `click` as the default event for actions on `<button>` elements.
>
> Certain other elements have default events, too. Here's the full list:
>
> Element           | Default event
> ----------------- | -------------
> a                 | click
> button            | click
> form              | submit
> input             | change
> input type=submit | click
> select            | change
> textarea          | change

Finally, in our `copy` method, we can select the input field's contents and call the clipboard API:

```js
  copy() {
    this.sourceTarget.select()
    document.execCommand("copy")
  }
```

Load the page in your browser and click the Copy button. Then switch back to your text editor and paste. You should see the PIN `1234`.

[img]

## Progressive Enhancement

* What if the browser doesn't support the copy API?
* What if JavaScript failed to load due to a CDN issue? What if it's disabled entirely?
* We can account for these cases using progressive enhancement techniques
* We'll hide "Copy to Clipboard" button initially
* Then we'll _feature-test_ support for the API
* If it's supported, we'll add a class name to the element to reveal the button
* Start by adding `class="clipboard-button"` to the button element:

```html
<div data-controller="clipboard">
  PIN: <input data-target="clipboard.source" type="text" value="1234" readonly>
  <button data-action="clipboard#copy" class="clipboard-button">Copy to Clipboard</button>
</div>
```

* Then add the following styles to `public/main.css`:

```css
.clipboard-button {
  display: none;
}

.clipboard--supported .clipboard-button {
  display: initial;
}
```

* Now we'll add an `initialize` method to do the feature test

```js
export default class extends Controller {
  static targets = [ "source" ]

  initialize() {
    if (document.queryCommandSupported("copy")) {
      this.element.classList.add("clipboard--supported")
    }
  }

  copy() {
    this.sourceTarget.select()
    document.execCommand("copy")
  }
}
```

## Stimulus Controllers are Reusable

* So far we've just seen a single controller on the page at a time
* The controllers we've built are reusable
* Any time we want to provide a way to copy a bit of text to the clipboard, all we need is markup on the page with the right annotations
* Let's go ahead and add another one to the page
* Copy and paste the markup, then change the `value` attribute:

```html
<div data-controller="clipboard">
  PIN: <input data-target="clipboard.source" type="text" value="3737" readonly>
  <button data-action="clipboard#copy" class="clipboard-button">Copy to Clipboard</button>
</div>
```

## Actions and Targets Can Go on Any Kind of Element

* Now let's add one more. This time we'll use a link instead of a button:

```html
<div data-controller="clipboard">
  PIN: <input data-target="clipboard.source" type="text" value="3737" readonly>
  <a href="#" data-action="clipboard#copy" class="clipboard-button">Copy to Clipboard</a>
</div>
```
* We don't want the browser's default behavior when clicking a link so let's update the `copy()` method to cancel the event:

```js
  copy(event) {
    event.preventDefault()
    this.sourceTarget.select()
    document.execCommand("copy")
  }
```

* We can use any kind of element we want as the trigger, as long as it has the `data-action` attribute on it
* We could even have multiple elements with the same action
