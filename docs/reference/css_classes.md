---
permalink: /reference/css-classes
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
import { Controller } from "stimulus"

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

Construct a CSS class attribute by joining together the controller identifier and logical name in the format `data-[identifier]-[logical-name]-class`. The attribute's value is a single CSS class name.

**Note:** CSS class attributes must be specified on the same element as the `data-controller` attribute.

## Properties

For each logical name defined in the `static classes` array, Stimulus adds the following _CSS class properties_ to your controller:

Name                    | Value
----------------------- | -----
`[logicalName]Class`    | The value of the CSS class attribute corresponding to `logicalName`
`has[LogicalName]Class` | A boolean indicating whether or not the CSS class attribute is present

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

**Note:** Stimulus will throw an error if you attempt to access a CSS class property when no matching CSS class attribute is present.

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
