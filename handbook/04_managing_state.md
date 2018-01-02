#### [<img src="../assets/logo.svg" width="12" height="12" alt="Stimulus">](../README.md) [The Stimulus Handbook](README.md)

---

# 4 Managing State

### 🚧 This chapter of The Stimulus Handbook is a work in progress.
We'll have it wrapped up in time for the 1.0 release. Thanks for your patience!

---

* Let's build a simple slideshow: A set of slides and buttons for flipping through them
* We'll manage the slideshow's state with DOM data attributes using the Stimulus data API
* Start with the basic HTML:

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

* Add a couple styles to hide all but the current slide:

```css
.slide {
  display: none;
}

.slide.slide--current {
  display: block;
}
```

* And here's our initial controller:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    this.render()
  }

  next() {
  }

  previous() {
  }

  render() {
    this.slideElements.forEach((element, index) => {
      element.classList.toggle("slide--current", index == this.index)
    })
  }

  get index() {
  }

  get slideElements() {
    return this.targets.findAll("slide")
  }
}
```

* (Describe what `this.render()` does?)
* (Describe what `this.targets.findAll()` does? Here or in `stimulus/handbook/02_hello_stimulus.md`?)
* Now let's implement `get index()`:

```js
  get index() {
    if (this.data.has("index")) {
      return parseInt(this.data.get("index"))
    } else {
      return 0
    }
  }
```

## Understanding the Data API

* The data API provides convenient methods for working with _scoped_ data attributes
* In the DOM, data attributes are scoped using the controller's _identifier_ (`slideshow` in this case)
  * `this.data.has("index")` checks if the element has a `data-slideshow-index` attribute
  * `this.data.get("index")` returns the value of the element's `data-slideshow-index` attribute
  * `this.data.set("index", value)` sets the value of the element's `data-slideshow-index` attribute

* Let's add a `set index()` method so we can write `index` too
* We'll save the value using the data API, and then `render()` to change slides:

```js
  set index(value) {
    this.data.set("index", value)
    this.render()
  }
```

* Now we can implement the `next()` and `previous()` methods
* They'll update the value of `index` if there's another slide to navigate to

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
    return this.slideElements.length - 1
  }
}
```

* We've filled in the missing pieces
* Let's take a look at our final controller:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    this.render()
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

  render() {
    this.slideElements.forEach((element, index) => {
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
    this.render()
  }

  get lastIndex() {
    return this.slideElements.length - 1
  }

  get slideElements() {
    return this.targets.findAll("slide")
  }
}
```

* Click through the slides and note how `data-slideshow-index` changes in the DOM
* Try starting on a different slide by setting an initial index in the HTML:
  ```html
  <div data-controller="slideshow"
       data-slideshow-index="2">…</div>
  ```

---

Next: [Working With External Resources](05_working_with_external_resources.md)
