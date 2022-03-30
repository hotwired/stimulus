---
permalink: /reference/css-classes.html
order: 05
---

# CSS Classes

In HTML, a _CSS class_ defines a set of styles which can be applied to elements using the `class` attribute.

CSS classes are a convenient tool for changing styles and playing animations programmatically. For example, a Stimulus controller might add a "loading" class to an element when it is performing an operation in the background, and then style that class in CSS to display a progress indicator:

```html
<form data-controller="search" class="search--busy">
```

```css
.search--busy {
  background-image: url(throbber.svg) no-repeat;
}
```

As an alternative to hard-coding classes with JavaScript strings, Stimulus lets you refer to CSS classes by _logical name_ using a combination of data attributes and controller properties.

## Definitions

Define CSS classes by logical name in your controller using the `static classes` array:

<meta data-controller="callout" data-callout-text-value="static classes = [ &quot;loading&quot; ]">

```js
// controllers/search_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = [ "loading" ]

  // …
}
```

## Attributes

The logical names defined in the controller's `static classes` array map to _CSS class attributes_ on the controller's element.

<meta data-controller="callout" data-callout-text-value="data-search-loading-class=&quot;search--busy&quot;">

```html
<form data-controller="search"
      data-search-loading-class="search--busy">
  <input data-action="search#loadResults">
</form>
```

Construct a CSS class attribute by joining together the controller identifier and logical name in the format `data-[identifier]-[logical-name]-class`. The attribute's value can be a single CSS class name or a list of multiple class names.

**Note:** CSS class attributes must be specified on the same element as the `data-controller` attribute.

If you want to specify multiple CSS classes for a logical name, separate the classes with spaces:

<meta data-controller="callout" data-callout-text-value="data-search-loading-class=&quot;bg-gray-500 animate-spinner cursor-busy&quot;">

```html
<form data-controller="search"
      data-search-loading-class="bg-gray-500 animate-spinner cursor-busy">
  <input data-action="search#loadResults">
</form>
```

## Properties

For each logical name defined in the `static classes` array, Stimulus adds the following _CSS class properties_ to your controller:

Kind        | Name                         | Value
----------- | ---------------------------- | -----
Singular    | `this.[logicalName]Class`    | The value of the CSS class attribute corresponding to `logicalName`
Plural      | `this.[logicalName]Classes`  | An array of all classes in the corresponding CSS class attribute, split by spaces
Existential | `this.has[LogicalName]Class` | A boolean indicating whether or not the CSS class attribute is present

<br>Use these properties to apply CSS classes to elements with the `add()` and `remove()` methods of the [DOM `classList` API](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).

For example, to display a loading indicator on the `search` controller's element before fetching results, you might implement the `loadResults` action like so:

<meta data-controller="callout" data-callout-text-value="this.loadingClass">

```js
export default class extends Controller {
  static classes = [ "loading" ]

  loadResults() {
    this.element.classList.add(this.loadingClass)

    fetch(/* … */)
  }
}
```

If a CSS class attribute contains a list of class names, its singular CSS class property returns the first class in the list.

Use the plural CSS class property to access all class names as an array. Combine this with [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to apply multiple classes at once:

<meta data-controller="callout" data-callout-text-value="...this.loadingClasses">

```js
export default class extends Controller {
  static classes = [ "loading" ]

  loadResults() {
    this.element.classList.add(...this.loadingClasses)

    fetch(/* … */)
  }
}
```

**Note:** Stimulus will throw an error if you attempt to access a CSS class property when a matching CSS class attribute is not present.

## Naming Conventions

Use camelCase to specify logical names in CSS class definitions. Logical names map to camelCase CSS class properties:

<meta data-controller="callout" data-callout-text-value="noResultsClass">
<meta data-controller="callout" data-callout-text-value="noResults">

```js
export default class extends Controller {
  static classes = [ "loading", "noResults" ]

  loadResults() {
    // …
    if (results.length == 0) {
      this.element.classList.add(this.noResultsClass)
    }
  }
}
```

In HTML, write CSS class attributes in kebab-case:

<meta data-controller="callout" data-callout-text-value="no-results">

```html
<form data-controller="search"
      data-search-loading-class="search--busy"
      data-search-no-results-class="search--empty">
```

When constructing CSS class attributes, follow the conventions for identifiers as described in [Controllers: Naming Conventions](controllers#naming-conventions).
