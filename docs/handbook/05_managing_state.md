---
permalink: /handbook/managing-state.html
order: 05
---

# Managing State

Most contemporary frameworks encourage you to keep state in JavaScript at all times. They treat the DOM as a write-only rendering target, reconciled by client-side templates consuming JSON from the server.

Stimulus takes a different approach. A Stimulus application's state lives as attributes in the DOM; controllers themselves are largely stateless. This approach makes it possible to work with HTML from anywhere—the initial document, an Ajax request, a Turbo visit, or even another JavaScript library—and have associated controllers spring to life automatically without any explicit initialization step.

## Building a Slideshow

In the last chapter, we learned how a Stimulus controller can maintain simple state in the document by adding a class name to an element. But what do we do when we need to store a value, not just a simple flag?

We'll investigate this question by building a slideshow controller which keeps its currently selected slide index in an attribute.

As usual, we'll begin with HTML:

```html
<div data-controller="slideshow">
  <button data-action="slideshow#previous"> ← </button>
  <button data-action="slideshow#next"> → </button>

  <div data-slideshow-target="slide">🐵</div>
  <div data-slideshow-target="slide">🙈</div>
  <div data-slideshow-target="slide">🙉</div>
  <div data-slideshow-target="slide">🙊</div>
</div>
```

Each `slide` target represents a single slide in the slideshow. Our controller will be responsible for making sure only one slide is visible at a time.

Let's draft our controller. Create a new file, `src/controllers/slideshow_controller.js`, as follows:

```js
// src/controllers/slideshow_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "slide" ]

  initialize() {
    this.index = 0
    this.showCurrentSlide()
  }

  next() {
    this.index++
    this.showCurrentSlide()
  }

  previous() {
    this.index--
    this.showCurrentSlide()
  }

  showCurrentSlide() {
    this.slideTargets.forEach((element, index) => {
      element.hidden = index != this.index
    })
  }
}
```

Our controller defines a method, `showCurrentSlide()`, which loops over each slide target, toggling the [`hidden` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) if its index matches.

We initialize the controller by showing the first slide, and the `next()` and `previous()` action methods advance and rewind the current slide.

> ### Lifecycle Callbacks Explained
>
> What does the `initialize()` method do? How is it different from the `connect()` method we've used before?
>
> These are Stimulus _lifecycle callback_ methods, and they're useful for setting up or tearing down associated state when your controller enters or leaves the document.
>
> Method       | Invoked by Stimulus…
> ------------ | --------------------
> initialize() | Once, when the controller is first instantiated
> connect()    | Anytime the controller is connected to the DOM
> disconnect() | Anytime the controller is disconnected from the DOM

Reload the page and confirm that the Next button advances to the next slide.

## Reading Initial State from the DOM

Notice how our controller tracks its state—the currently selected slide—in the `this.index` property.

Now say we'd like to start one of our slideshows with the second slide visible instead of the first. How can we encode the start index in our markup?

One way might be to load the initial index with an HTML `data` attribute. For example, we could add a `data-index` attribute to the controller's element:

```html
<div data-controller="slideshow" data-index="1">
```

Then, in our `initialize()` method, we could read that attribute, convert it to an integer, and pass it to `showCurrentSlide()`:

```js
  initialize() {
    this.index = Number(this.element.dataset.index)
    this.showCurrentSlide()
  }
```

This might get the job done, but it's clunky, requires us to make a decision about what to name the attribute, and doesn't help us if we want to access the index again or increment it and persist the result in the DOM.

### Using Values

Stimulus controllers support typed value properties which automatically map to data attributes. When we add a value definition to the top of our controller class:

```js
  static values = { index: Number }
```

Stimulus will create a `this.indexValue` controller property associated with a `data-slideshow-index-value` attribute, and handle the numeric conversion for us.

Let's see that in action. Add the associated data attribute to our HTML:

```html
<div data-controller="slideshow" data-slideshow-index-value="1">
```

Then add a `static values` definition to the controller and change the `initialize()` method to log `this.indexValue`:

```js
export default class extends Controller {
  static values = { index: Number }

  initialize() {
    console.log(this.indexValue)
    console.log(typeof this.indexValue)
  }

  // …
}
```

Reload the page and verify that the console shows `1` and `Number`.

> ### What's with that `static values` line?
>
> Similar to targets, you define values in a Stimulus controller by describing them in a static object property called `values`. In this case, we've defined a single numeric value called `index`. You can read more about value definitions in the [reference documentation](/reference/values).

Now let's update `initialize()` and the other methods in the controller to use `this.indexValue` instead of `this.index`. Here's how the controller should look when we're done:

```js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "slide" ]
  static values = { index: Number }

  initialize() {
    this.showCurrentSlide()
  }

  next() {
    this.indexValue++
    this.showCurrentSlide()
  }

  previous() {
    this.indexValue--
    this.showCurrentSlide()
  }

  showCurrentSlide() {
    this.slideTargets.forEach((element, index) => {
      element.hidden = index != this.indexValue
    })
  }
}
```

Reload the page and use the web inspector to confirm the controller element's `data-slideshow-index-value` attribute changes as you move from one slide to the next.

### Change Callbacks

Our revised controller improves on the original version, but the repeated calls to `this.showCurrentSlide()` stand out. We have to manually update the state of the document when the controller initializes and after every place where we update `this.indexValue`.

We can define a Stimulus value change callback to clean up the repetition and specify how the controller should respond whenever the index value changes.

First, remove the `initialize()` method and define a new method, `indexValueChanged()`. Then remove the calls to `this.showCurrentSlide()` from `next()` and `previous()`:

```js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "slide" ]
  static values = { index: Number }

  next() {
    this.indexValue++
  }

  previous() {
    this.indexValue--
  }

  indexValueChanged() {
    this.showCurrentSlide()
  }

  showCurrentSlide() {
    this.slideTargets.forEach((element, index) => {
      element.hidden = index != this.indexValue
    })
  }
}
```

Reload the page and confirm the slideshow behavior is the same.

Stimulus calls the `indexValueChanged()` method at initialization and in response to any change to the `data-slideshow-index-value` attribute. You can even fiddle with the attribute in the web inspector and the controller will change slides in response. Go ahead—try it out!

### Setting Defaults

It's also possible to set a default values as part of the static definition. This is done like so:

```js
  static values = { index: { type: Number, default: 2 } }
```

That would start the index at 2, if no `data-slideshow-index-value` attribute was defined on the controller element. If you had other values, you can mix and match what needs a default and what doesn't:

```js
  static values = { index: Number, effect: { type: String, default: "kenburns" } }
```

## Wrap-Up and Next Steps

In this chapter we've seen how to use the values to load and persist the current index of a slideshow controller.

From a usability perspective, our controller is incomplete. The Previous button appears to do nothing when you are looking at the first slide. Internally, `indexValue` decrements from `0` to `-1`. Could we make the value wrap around to the _last_ slide index instead? (There's a similar problem with the Next button.)

Next we'll look at how to keep track of external resources, such as timers and HTTP requests, in Stimulus controllers.
