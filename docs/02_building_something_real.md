# Building Something Real

COVERS: Behavioral CSS, progressive enhancement

* Logging hello to the console isn't very exciting
* Let's build something we might actually use
* We'll go over a real example from Basecamp

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

* Next we'll create a Stimulus controller called `ClipboardController` to perform the copying
* Create `src/controllers/clipboard_controller.js` and add an empty method `copy`:

```js
export default class ClipboardController extends Controller {
  copy() {
  }
}
```

* Now we can wire up the controller to our markup
* Add `data-controller="clipboard"` to the outer `<div>`. Any time this attribute appears on an element, Stimulus will connect a `ClipboardController`
* Add `data-target="clipboard.source"` to the text field so that we can refer to it by the logical name `source`
* Add `data-action="clipboard#copy"` to the button so clicking it calls the `copy` method

```html
<div data-controller="clipboard">
  <input data-target="clipboard.source" type="text" value="https://basecamp.com/">
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

* (Describe why we can omit `click->` from the `data-action` attribute)

* Now we can implement the `copy` action:

```js
export default class ClipboardController extends Controller {
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

* The last thing we'd like to do is hide the input field
* We could hide the input element with JavaScript instead by applying an inline style to it
* Stimulus encourages you to use behavioral CSS instead by matching `data-target` attributes
* Here we select all elements which have `clipboard.source` in the `data-target` attribute and mark them as invisible:

```css
[data-target~="clipboard.source"] {
  display: none;
}
```

* Behavioral CSS should apply _intrinsic_ styles only: whether an element is visible or not, or sometimes how it is positioned, but _not_ what it looks like
* To style appearance, always use CSS class names

* (Demonstrate that the input field is invisible now)

* What if the browser doesn't support the copy API?
* What if JavaScript failed to load due to a CDN issue? What if it's disabled entirely?
* We can account for these cases using progressive enhancement techniques
* We'll _feature-test_ support for the API
* If it's supported, we'll add a class name to the element
* Then we'll condition our behavioral CSS to require that class

* (Example)
* (Demonstrate by commenting out the script tag)
