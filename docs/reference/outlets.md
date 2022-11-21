---
permalink: /reference/outlets.html
order: 04
---

# Outlets

_Outlets_ let you reference Stimulus _controller instances_ and their _controller element_ from within another Stimulus Controller by using CSS selectors.

The use of Outlets helps with cross-controller communication and coordination as an alternative to dispatching custom events on controller elements.

They are conceptually similar to [Stimulus Targets](https://stimulus.hotwired.dev/reference/targets) but with the difference that they reference a Stimulus controller instance plus its associated controller element.

<meta data-controller="callout" data-callout-text-value='data-search-result-outlet=".result"'>
<meta data-controller="callout" data-callout-text-value='class="result"'>


```html
<div data-controller="search" data-search-result-outlet=".result">
  ...
</div>

...

<div id="results">
  <div class="result" data-controller="result">...</div>
  <div class="result" data-controller="result">...</div>
  ...
</div>
```

While a **target** is a specifically marked element **within the scope** of its own controller element, an **outlet** can be located **anywhere on the page** and doesn't necessarily have to be within the controller scope.

## Attributes and Names

The `data-search-result-outlet` attribute is called an _outlet attribute_, and its value is a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) which you can use to refer to other controller elements which should be available as outlets on the _host controller_.

```html
data-[identifier]-[outlet]-outlet="[selector]"
```

<meta data-controller="callout" data-callout-text-value='data-search-result-outlet=".result"'>


```html
<div data-controller="search" data-search-result-outlet=".result"></div>
```

## Definitions

Define controller identifiers in your controller class using the `static outlets` array. This array declares which other controller identifiers can be used as outlets on this controller:

<meta data-controller="callout" data-callout-text-value='static outlets'>
<meta data-controller="callout" data-callout-text-value='"result"'>


```js
// search_controller.js

export default class extends Controller {
  static outlets = [ "result" ]

  connect () {
    this.resultOutlets.forEach(result => ...)
  }
}
```

## Properties

For each outlet defined in the `static outlets` array, Stimulus adds five properties to your controller, where `[name]` corresponds to the outlet's controller identifier:

| Kind | Property name | Return Type | Effect
| ---- | ------------- | ----------- | -----------
| Existential | `has[Name]Outlet` | `Boolean` | Tests for presence of a `[name]` outlet
| Singular | `[name]Outlet` | `Controller` | Returns the `Controller` instance of the first `[name]` outlet or throws an exception if none is present
| Plural | `[name]Outlets` | `Array<Controller>` | Returns the `Controller` instances of all `[name]` outlets
| Singular | `[name]OutletElement` | `Element` | Returns the Controller `Element` of the first `[name]` outlet or throws an exception if none is present
| Plural | `[name]OutletElements` | `Array<Element>` | Returns the Controller `Element`'s of all `[name]` outlets

## Accessing Controllers and Elements

Since you get back a `Controller` instance from the `[name]Outlet` and `[name]Outlets` properties you are also able to access the Values, Classes, Targets and all of the other properties and functions that controller instance defines:

```js
this.resultOutlet.idValue
this.resultOutlet.imageTarget
this.resultOutlet.activeClasses
```

You are also able to invoke any function the outlet controller may define:

```js
// result_controller.js

export default class extends Controller {
  markAsSelected(event) {
    // ...
  }
}

// search_controller.js

export default class extends Controller {
  static outlets = [ "result" ]

  selectAll(event) {
    this.resultOutlets.forEach(result => result.markAsSelected(event))
  }
}
```

Similarly with the Outlet Element, it allows you to call any function or property on [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element):

```js
this.resultOutletElement.dataset.value
this.resultOutletElement.getAttribute("id")
this.resultOutletElements.map(result => result.hasAttribute("selected"))
```

## Outlet Callbacks

Outlet callbacks are specially named functions called by Stimulus to let you respond to whenever an outlet is added or removed from the page.

To observe outlet changes, define a function named `[name]OutletConnected()` or `[name]OutletDisconnected()`.

```js
// search_controller.js

export default class extends Controller {
  static outlets = [ "result" ]

  resultOutletConnected(outlet, element) {
    // ...
  }

  resultOutletDisconnected(outlet, element) {
    // ...
  }
}
```

### Outlets are Assumed to be Present

When you access an Outlet property in a Controller, you assert that at least one corresponding Outlet is present. If the declaration is missing and no matching outlet is found Stimulus will throw an exception:

```html
Missing outlet element "result" for "search" controller
```

### Optional outlets

If an Outlet is optional or you want to assert that at least Outlet is present, you must first check the presence of the Outlet using the existential property:

```js
if (this.hasResultOutlet) {
  this.resultOutlet.safelyCallSomethingOnTheOutlet()
}
```

### Referencing Non-Controller Elements

Stimulus will throw an exception if you try to declare an element as an outlet which doesn't have a corresponding `data-controller` and identifier on it:

<meta data-controller="callout" data-callout-text-value='data-search-result-outlet="#result"'>
<meta data-controller="callout" data-callout-text-value='id="result"'>


```html
<div data-controller="search" data-search-result-outlet="#result"></div>

<div id="result"></div>
```

Would result in:
```html
Missing "data-controller=result" attribute on outlet element for
"search" controller`
```
