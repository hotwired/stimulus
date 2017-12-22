# Stimulus

### Save yourself from JavaScript soup.

Stimulus is a front-end framework with a structured set of conventions for handling events and tracking the lifecycle of DOM elements.

```html
<div data-controller="hello">
  <input data-target="hello.name" type="text">
  <button data-action="click->hello#greet">Greet</button>
</div>
```

Annotate your HTML with controller, target, and action attributes. Then write a compatible controller. Stimulus wires it up for you automatically:

```js
// hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  greet() {
    console.log(`Hello, ${this.name}!`)
  }

  get name() {
    return this.inputElement.value
  }

  get inputElement() {
    return this.targets.find("name")
  }
}
```

You can write your first controller in five minutes by diving straight into [The Stimulus Handbook](handbook/README.md).

## Installation

Include the [`stimulus` npm package](https://www.npmjs.com/package/stimulus) in your application using your preferred asset bundling tool.

Or, load the [`stimulus.umd.js`](https://unpkg.com/stimulus/dist/stimulus.umd.js) browser bundle in a `<script>` tag directly and access the API through the `window.Stimulus` global.

---

© 2018 Basecamp, LLC. Stimulus is [MIT-licensed](LICENSE.md) software.
