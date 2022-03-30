---
permalink: /reference/targets.html
order: 03
---

# Targets

_Targets_ let you reference important elements by name.

<meta data-controller="callout" data-callout-text-value="search.query">
<meta data-controller="callout" data-callout-text-value="search.errorMessage">
<meta data-controller="callout" data-callout-text-value="search.results">

```html
<div data-controller="search">
  <input type="text" data-search-target="query">
  <div data-search-target="errorMessage"></div>
  <div data-search-target="results"></div>
</div>
```

## Attributes and Names

The `data-search-target` attribute is called a _target attribute_, and its value is a space-separated list of _target names_ which you can use to refer to the element in the `search` controller.

<meta data-controller="callout" data-callout-text-value="search">
<meta data-controller="callout" data-callout-text-value="results">

```html
<div data-controller="s​earch">
  <div data-search-target="results"></div>
</div>
```

## Definitions

Define target names in your controller class using the `static targets` array:

```js
// controllers/search_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "query", "errorMessage", "results" ]
  // …
}
```

## Properties

For each target name defined in the `static targets` array, Stimulus adds the following properties to your controller, where `[name]` corresponds to the target's name:

Kind        | Name                   | Value
----------- | ---------------------- | -----
Singular    | `this.[name]Target`    | The first matching target in scope
Plural      | `this.[name]Targets`   | An array of all matching targets in scope
Existential | `this.has[Name]Target` | A boolean indicating whether there is a matching target in scope

<br>**Note:** Accessing the singular target property will throw an error when there is no matching element.

## Shared Targets

Elements can have more than one target attribute, and it's common for targets to be shared by multiple controllers.

<meta data-controller="callout" data-callout-text-value="data-search-target=&quot;projects&quot;">
<meta data-controller="callout" data-callout-text-value="data-search-target=&quot;messages&quot;">
<meta data-controller="callout" data-callout-text-value="data-checkbox-target=&quot;input&quot;">

```html
<form data-controller="search checkbox">
  <input type="checkbox" data-search-target="projects" data-checkbox-target="input">
  <input type="checkbox" data-search-target="messages" data-checkbox-target="input">
  …
</form>
```

In the example above, the checkboxes are accessible inside the `search` controller as `this.projectsTarget` and `this.messagesTarget`, respectively.

Inside the `checkbox` controller, `this.inputTargets` returns an array with both checkboxes.

## Optional Targets

If your controller needs to work with a target which may or may not be present, condition your code based on the value of the existential target property:

```js
if (this.hasResultsTarget) {
  this.resultsTarget.innerHTML = "…"
}
```

## Connected and Disconnected Callbacks

Target _element callbacks_ let you respond whenever a target element is added or
removed within the controller's element.

Define a method `[name]TargetConnected` or `[name]TargetDisconnected` in the controller, where `[name]` is the name of the target you want to observe for additions or removals. The method receives the element as the first argument.

Stimulus invokes each element callback any time its target elements are added or removed after `connect()` and before `disconnect()` lifecycle hooks.

```js
export default class extends Controller {
  static targets = [ "item" ]

  itemTargetConnected(element) {
    this.sortElements(this.itemTargets)
  }

  itemTargetDisconnected(element) {
    this.sortElements(this.itemTargets)
  }

  // Private
  sortElements(itemTargets) { /* ... */ }
}
```

**Note** During the execution of `[name]TargetConnected` and
`[name]TargetDisconnected` callbacks, the `MutationObserver` instances behind
the scenes are paused. This means that if a callback add or removes a target
with a matching name, the corresponding callback _will not_ be invoked again.

## Naming Conventions

Always use camelCase to specify target names, since they map directly to properties on your controller.
