---
permalink: /reference/targets
order: 02
---

# Targets

_Targets_ let you reference important elements by name.

<meta data-controller="callout" data-callout-value="search.query">
<meta data-controller="callout" data-callout-value="search.errorMessage">
<meta data-controller="callout" data-callout-value="search.results">

```html
<div data-controller="search">
  <input type="text" data-target="search.query">
  <div data-target="search.errorMessage"></div>
  <div data-target="search.results"></div>
</div>
```

## Descriptors

The `data-target` value `search.query` is called a _target descriptor_. This descriptor says:
* `search` is the scope's controller identifier
* `query` is the target name, which can be anything you choose

The identifier in a target descriptor must match a `data-controller` identifier specified on the element or one of its parents.

## Definitions

Define target names in your controller class using the `static targets` array:

```js
// controllers/search_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "query", "errorMessage", "results" ]
  // …
}
```

**Note:** You may need to enable support in your JavaScript environment for the static class properties standard (see [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)).

## Properties

For each target name defined in the `static targets` array, Stimulus adds the following properties to your controller, where `[name]` corresponds to the target's name:

Type        | Name                   | Value
----------- | ---------------------- | -----
Singular    | `this.[name]Target`    | The first matching target in scope
Plural      | `this.[name]Targets`   | An array of all matching targets in scope
Existential | `this.has[Name]Target` | A boolean indicating whether there is a matching target in scope

<br>**Note:** Accessing the singular target property will throw an error when there is no matching element.

## Multiple Targets

The `data-target` attribute's value is a space-separated list of target descriptors.

It's possible for an element to have more than one target descriptor, and it's common for multiple elements in a scope to share the same descriptor.

<meta data-controller="callout" data-callout-value="search.projects">
<meta data-controller="callout" data-callout-value="search.messages">
<meta data-controller="callout" data-callout-value="checkbox.input">

```html
<form data-controller="search checkbox">
  <input type="checkbox" data-target="search.projects checkbox.input">
  <input type="checkbox" data-target="search.messages checkbox.input">
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

## Naming Conventions

Always use camelCase to specify target names, since they map directly to properties on your controller.
