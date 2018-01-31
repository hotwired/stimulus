---
slug: /managing-state
---

# Managing State

Most contemporary frameworks encourage you to keep state in JavaScript at all times. They treat the DOM as a write-only rendering target, reconciled by client-side templates consuming JSON from the server.

Stimulus takes a different approach. A Stimulus application's state lives as attributes in the DOM; controllers themselves are largely stateless. This approach makes it possible to work with HTML from anywhere—the initial document, an Ajax request, a Turbolinks visit, or even another JavaScript library—and have associated controllers spring to life automatically without any explicit initialization step.

## Building a Slideshow

In the last chapter, we learned how a Stimulus controller can maintain simple state in the document by adding a class name to an element. But what do we do when we need to store a value, not just a simple flag?

We'll investigate this question by building a slideshow controller which keeps its currently selected slide index in an attribute.

As usual, we'll begin with HTML:

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

Each `slide` target represents a single slide in the slideshow. Our controller will be responsible for making sure only one slide is visible at a time.

We can use CSS to hide all slides by default, only showing them when the `slide--current` class is applied:

```css
.slide {
  display: none;
}

.slide.slide--current {
  display: block;
}
```

Now let's draft our controller. Create a new file, `src/controllers/slideshow_controller.js`, as follows:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "slide" ]

  initialize() {
    this.showSlide(0)
  }

  next() {
    this.showSlide(this.index + 1)
  }

  previous() {
    this.showSlide(this.index - 1)
  }

  showSlide(index) {
    this.index = index
    this.slideTargets.forEach((el, i) => {
      el.classList.toggle("slide--current", index == i)
    })
  }
}
```

Our controller defines a method, `showSlide()`, which loops over each slide target, toggling the `slide--current` class if its index matches.

We initialize the controller by showing the first slide, and the `next()` and `previous()` action methods advance and rewind the current slide.

> ### Lifecycle Callbacks Explained
>
> What does the `initialize()` method do? How is it different from the `connect()` method we've used before?
>
> These are Stimulus _lifecycle callback_ methods, and they're useful for setting up or tearing down associated state when your controller enters or leaves the document.
>
> Callback   | Invoked by Stimulus…
> ---------- | --------------------
> initialize | once, when the controller is first instantiated
> connect    | anytime the controller is connected to the DOM
> disconnect | anytime the controller is disconnected from the DOM

Reload the page and confirm that the Next button advances to the next slide.

## Reading Initial State from the DOM

Notice how our controller tracks its state—the currently selected slide—in the `this.index` property.

Now say we'd like to start one of our slideshows with the second slide visible instead of the first. How can we encode the start index in our markup?

One way might be to load the initial index with an HTML `data` attribute. For example, we could add a `data-slideshow-index` attribute to the controller's element:

```html
<div data-controller="slideshow" data-slideshow-index="1">
```

Then, in our `initialize()` method, we could read that attribute, convert it to an integer, and pass it to `showSlide()`:

```js
  initialize() {
    const index = parseInt(this.element.getAttribute("data-slideshow-index"))
    this.showSlide(index)
  }
```

Working with `data` attributes on controller elements is common enough that Stimulus provides an API for it. Instead of reading the attribute value directly, we can use the more convenient `this.data.get()` method:

```js
  initialize() {
    const index = parseInt(this.data.get("index"))
    this.showSlide(index)
  }
```

> ### The Data API Explained
>
> Each Stimulus controller has a `this.data` object with `has()`, `get()`, and `set()` methods. These methods provide convenient access to `data` attributes on the controller's element, scoped by the controller's identifier.
>
> For example, in our controller above:
> * `this.data.has("index")` returns `true` if the controller's element has a `data-slideshow-index` attribute
> * `this.data.get("index")` returns the string value of the element's `data-slideshow-index` attribute
> * `this.data.set("index", index)` sets the element's `data-slideshow-index` attribute to the string value of `index`
>
> If your attribute name consists of more than one word, reference it as `camelCase` in JavaScript and `attribute-case` in HTML. For example, you can read the `data-slideshow-current-class-name` attribute with `this.data.get("currentClassName")`.

Add the `data-slideshow-index` attribute to your controller's element, then reload the page to confirm the slideshow starts on the specified slide.

## Persisting State in the DOM

We've seen how to bootstrap our slideshow controller's initial slide index by reading it from a `data` attribute.

As we navigate through the slideshow, however, that attribute does not stay in sync with the controller's `index` property. If we were to clone the controller's element in the document, the clone's controller would revert back to its initial state.

We can improve our controller by defining a getter and setter for the `index` property which delegates to the Data API:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "slide" ]

  initialize() {
    this.showCurrentSlide()
  }

  next() {
    this.index++
  }

  previous() {
    this.index--
  }

  showCurrentSlide() {
    this.slideTargets.forEach((el, i) => {
      el.classList.toggle("slide--current", this.index == i)
    })
  }

  get index() {
    return parseInt(this.data.get("index"))
  }

  set index(value) {
    this.data.set("index", value)
    this.showCurrentSlide()
  }
}
```

Here we've renamed `showSlide()` to `showCurrentSlide()` and changed it to read from `this.index`. The `get index()` method returns the controller element's `data-slideshow-index` attribute as an integer. The `set index()` method sets that attribute and then refreshes the current slide.

Now our controller's state lives entirely in the DOM.

## Wrap-Up and Next Steps

In this chapter we've seen how to use the Stimulus Data API to load and persist the current index of a slideshow controller.

From a usability perspective, our controller is incomplete. Consider how you might revise the controller to address the following issues:

* The Previous button appears to do nothing when you are looking at the first slide. Internally, the `index` value decrements from `0` to `-1`. Could we make the value wrap around to the _last_ slide index instead? (There's a similar problem with the Next button.)
* If we forget to specify the `data-slideshow-index` attribute, the `parseInt()` call in our `get index()` method will return `NaN`. Could we fall back to a default value of `0` in this case?

Next we'll look at how to keep track of external resources, such as timers and HTTP requests, in Stimulus controllers.
