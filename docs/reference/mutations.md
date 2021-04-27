---
permalink: /reference/mutations
order: 06
---

# Mutations

_Mutations_ are how you handle changes to DOM elements and their attributes in your controllers.

<meta data-controller="callout" data-callout-text-value="aria-expanded->combobox#toggle">

```html
<div data-controller="combobox">
  <input type="search" data-mutation="aria-expanded->combobox#toggle">
</div>
```

<meta data-controller="callout" data-callout-text-value="toggle">

```js
// controllers/combobox_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  toggle(mutationRecords) {
    // …
  }
}
```

A mutation is a connection between:

* a controller method
* the controller's element
* a DOM mutation observer

## Descriptors

The `data-mutation` value `aria-expanded->combobox#toggle` is called a _mutation descriptor_. In this descriptor:

* `aria-expanded` is the name of the attribute to listen for changes to
* `combobox` is the controller identifier
* `toggle` is the name of the method to invoke

### Mutations Shorthand

Stimulus lets you shorten the mutation descriptors when observing mutations to _any_ attribute, by omitting the attribute name:

<meta data-controller="callout" data-callout-text-value="combobox#toggle">

```html
<div data-controller="combobox" data-mutation="combobox#toggle">…</div>
```

### Options

You can append one or more _mutation options_ to a mutation descriptor if you
need to specify [MutationObserverInit
options](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit).

<meta data-controller="callout" data-callout-text-value="aria-expanded">
<meta data-controller="callout" data-callout-text-value=":subtree">

```html
<div data-controller="combobox" data-mutation="aria-expanded->combobox#toggle:subtree">…</div>
```

When provided, the attribute name serves as the `attributeFilter` option and
defaults the `{ attribute: true }`.

Stimulus supports the following mutation options:

Mutation option | MutationObserver option
------------------------- | -------------------------
`:subtree`                | `{ subtree: true }`
`:childList`              | `{ childList: true }`
`:attributes`             | `{ attributes: true }`
`:attributeOldValue`      | `{ attributeOldValue: true }`
`:characterData`          | `{ characterData: true }`
`:characterDataOldValue ` | `{ characterData: true }`


## MutationRecord Objects

A _mutation method_ is the method in a controller which serves as an mutation's event listener.

The first argument to a mutation method is an array of DOM
[MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord)
_objects_. You may want access to the event for a number of reasons, including:

* to find out which element was mutated
* to read the attribute's previous value

The following basic properties are common to all events:

MutationRecord Property | Value
----------------------- | -----
mutationRecord.type     | The name of the event (e.g. `"click"`)
mutationRecord.target   | The target that dispatched the event (i.e. the innermost element that was clicked)

## Multiple Mutations

The `data-mutation` attribute's value is a space-separated list of mutation descriptors.

It's common for any given element to have many actions. For example, the following dialog element calls a `modal` controller's `backdrop()` method and a `focus` controller's `trap()` method when the `open` attribute changes:

<meta data-controller="callout" data-callout-text-value="open->modal#backdrop">
<meta data-controller="callout" data-callout-text-value="open->focus#trap">

```html
<dialog data-action="open->modal#backdrop open->focus#trap">
```

When an element has more than one action for the same mutation, Stimulus invokes the actions from left to right in the order that their descriptors appear.

## Naming Conventions

Always use camelCase to specify action names, since they map directly to methods on your controller.

Avoid action names that repeat the mutation's name, such as `open`, `onOpen`, or `handleOpen`:

<meta data-controller="callout" data-callout-text-value="#open" data-callout-type-value="avoid">

```html
<dialog data-action="open->modal#open">Don't</dialog>
```

Instead, name your action methods based on what will happen when they're called:

<meta data-controller="callout" data-callout-text-value="#backdrop" data-callout-type-value="prefer">

```html
<dialog data-action="open->modal#backdrop">Do</dialog>
```

This will help you reason about the behavior of a block of HTML without having to look at the controller source.
