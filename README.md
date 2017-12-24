# Stimulus

### Save yourself from JavaScript soup.

Stimulus is a front-end framework with structured conventions for handling events and tracking the lifecycle of DOM elements. Sprinkle your HTML with magic controller, target, and action attributes:

```html
<div data-controller="hello">
  <input data-target="hello.name" type="text">
  <button data-action="click->hello#greet">Greet</button>
</div>
```

Then write a compatible controller. Stimulus brings it to life automatically:

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

Unlike other frameworks, Stimulus is _render-agnostic_—it doesn't care when or how you change the DOM. Stimulus continuously watches the page, kicking in as soon as magic attributes appear or disappear. That makes it a great fit for static sites, server-rendered applications, and Turbolinks-style SPAs.

You can write your first controller in five minutes by following along in [The Stimulus Handbook](handbook/README.md).

## Installing Stimulus

Stimulus integrates with the [webpack](https://webpack.js.org/) asset packager to automatically load controller files from a folder in your app.

You can use Stimulus with other asset packaging systems, too. And if you prefer no build step at all, just drop a `<script>` tag on the page and get right down to business.

See the [Installation Guide](INSTALLING.md) for detailed instructions.

---

© 2018 Basecamp, LLC. Stimulus is [MIT-licensed](LICENSE.md) software.
