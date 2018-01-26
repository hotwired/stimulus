---
---

# 4: Managing State

Let's build a simple slideshow—a set of slides and two buttons for navigating them. We'll manage the slideshow's state with DOM data attributes using Stimulus’ Data API.

As usual, it all starts with some HTML:

```html
<div data-controller="slideshow">
  <button data-action="slideshow#previous">←</button>
  <button data-action="slideshow#next">→</button>

  <div data-target="slideshow.slide" class="slide">🐵</div>
  <div data-target="slideshow.slide" class="slide">🙈</div>
  <div data-target="slideshow.slide" class="slide">🙉</div>
  <div data-target="slideshow.slide" class="slide">🙊</div>
</div>
```

We'll add a couple styles for controlling visbility:

```css
.slide {
  display: none;
}

.slide.slide--current {
  display: block;
}
```

Slides are all hidden by default, and we can reveal one by adding the `slide--current` class name to it.

Now let's start writing our controller:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "slide" ]

  initialize() {
    this.showCurrentSlide()
  }

  next() {
  }

  previous() {
  }

  showCurrentSlide() {
    this.slideTargets.forEach((element, index) => {
      element.classList.toggle("slide--current", index == this.index)
    })
  }

  get index() {
  }
}
```

We have a few methods that aren't implemented yet, let's start with `get index()`:

```js
  get index() {
    if (this.data.has("index")) {
      return parseInt(this.data.get("index"))
    } else {
      return 0
    }
  }
```

> ### 💡 The Data API Explained
>
> Stimulus provides convenient methods for working with data attributes on controller elements. They use a controller's _identifier_ in the attribute name to _scope_ them to that controller. Let's see how the Data API works with our controller:
> * `this.data.has("index")` checks if the element has a `data-slideshow-index` attribute
> * `this.data.get("index")` returns the value of the element's `data-slideshow-index` attribute
> * `this.data.set("index", value)` sets the value of the element's `data-slideshow-index` attribute

Let's add a `set index()` method so we can write `index` too. We'll persist the value using the Data API, and then call `showCurrentSlide()` to change slides:

```js
  set index(value) {
    this.data.set("index", value)
    this.showCurrentSlide()
  }
```

Now we can implement the `next()` and `previous()` action methods. They'll update the value of `index` if there's a slide to navigate to in that direction.

```js
  next() {
    if (this.index < this.lastIndex) {
      this.index++
    }
  }

  previous() {
    if (this.index > 0) {
      this.index--
    }
  }

  get lastIndex() {
    return this.slideTargets.length - 1
  }
```

We've filled in all the missing pieces now. Let's take a look at our final controller:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "slide" ]

  initialize() {
    this.showCurrentSlide()
  }

  next() {
    if (this.index < this.lastIndex) {
      this.index++
    }
  }

  previous() {
    if (this.index > 0) {
      this.index--
    }
  }

  showCurrentSlide() {
    this.slideTargets.forEach((element, index) => {
      element.classList.toggle("slide--current", index == this.index)
    })
  }

  get index() {
    if (this.data.has("index")) {
      return parseInt(this.data.get("index"))
    } else {
      return 0
    }
  }

  set index(value) {
    this.data.set("index", value)
    this.showCurrentSlide()
  }

  get lastIndex() {
    return this.slideTargets.length - 1
  }
}
```

To wrap up, let's inspect our working controller in action:

* Navigate through the slides and note how `data-slideshow-index` changes in the DOM.
* Try starting on a different slide by setting an initial `index` in the HTML and reloading:
  ```html
  <div data-controller="slideshow"
       data-slideshow-index="2">…</div>
  ```
