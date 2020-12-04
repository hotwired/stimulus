# <img src="assets/logo.svg?sanitize=true" width="24" height="24" alt="Stimulus"> Stimulus

### A modest JavaScript framework for the HTML you already have

Stimulus is a JavaScript framework with modest ambitions. It doesn't seek to take over your entire front-end—in fact, it's not concerned with rendering HTML at all. Instead, it's designed to augment your HTML with just enough behavior to make it shine. Stimulus pairs beautifully with [Turbolinks](https://github.com/turbolinks/turbolinks) to provide a complete solution for fast, compelling applications with a minimal amount of effort.

How does it work? Sprinkle your HTML with controller, target, and action attributes:

```html
<div data-controller="hello">
  <input data-hello-target="name" type="text">

  <button data-action="click->hello#greet">Greet</button>

  <span data-hello-target="output"></span>
</div>
```

Then write a compatible controller. Stimulus brings it to life automatically:

```js
// hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "name", "output" ]

  greet() {
    this.outputTarget.textContent =
      `Hello, ${this.nameTarget.value}!`
  }
}
```

Stimulus continuously watches the page, kicking in as soon as attributes appear or disappear. It works with any update to the DOM, regardless of whether it comes from a full page load, a Turbolinks page change, or an Ajax request. Stimulus manages the whole lifecycle.

You can write your first controller in five minutes by following along in the [Stimulus Handbook](https://stimulusjs.org/handbook/introduction).

You can read more about why we created this new framework in [The Origin of Stimulus](https://stimulusjs.org/handbook/origin).

## Installing Stimulus

Stimulus integrates with the [webpack](https://webpack.js.org/) asset packager to automatically load controller files from a folder in your app.

You can use Stimulus with other asset packaging systems, too. And if you prefer no build step at all, just drop a `<script>` tag on the page and get right down to business.

See the [Installation Guide](https://stimulusjs.org/handbook/installing) for detailed instructions.

## Getting Help & Contributing Back

Looking for the docs? Once you've read through the Handbook, consult the [Stimulus Reference](https://stimulusjs.org/reference/controllers) for API details.

Have a question about Stimulus? Connect with other Stimulus developers on the [Stimulus Discourse](https://discourse.stimulusjs.org/) community forum.

Find a bug? Head over to our [issue tracker](https://github.com/stimulusjs/stimulus/issues) and we'll do our best to help. We love pull requests, too!

We expect all Stimulus contributors to abide by the terms of our [Code of Conduct](CODE_OF_CONDUCT.md).

## Acknowledgments

Stimulus is [MIT-licensed](LICENSE.md) open-source software from [Basecamp](https://basecamp.com/), the creators of [Ruby on Rails](http://rubyonrails.org).

Continuous integration is generously provided by open-source grants from [CircleCI](https://circleci.com) and [Sauce Labs](https://saucelabs.com/open-source).

---

© 2020 Basecamp, LLC.
