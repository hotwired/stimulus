---
permalink: /reference/actions
order: 01
---

# Actions

_Actions_ are how you handle DOM events in your controllers.

<meta data-controller="callout" data-callout-value="click->gallery#next">

```html
<div data-controller="gallery">
  <button data-action="click->gallery#next">…</button>
</div>
```

<meta data-controller="callout" data-callout-value="next">

```js
// controllers/gallery_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  next(event) {
    // …
  }
}
```

An action is a connection between:

* a controller method
* the controller's element
* a DOM event listener

## Descriptors

The `data-action` value `click->gallery#next` is called an _action descriptor_. In this descriptor:

* `click` is the name of the DOM event to listen for
* `gallery` is the controller identifier
* `next` is the name of the method to invoke

### Event Shorthand

Stimulus lets you shorten the action descriptors for some common element/event pairs, such as the button/click pair above, by omitting the event name:

<meta data-controller="callout" data-callout-value="gallery#next">

```html
<button data-action="gallery#next">…</button>
```

The full set of these shorthand pairs is as follows:

Element           | Default Event
----------------- | -------------
a                 | click
button            | click
form              | submit
input             | change
input type=submit | click
select            | change
textarea          | change

### Global Events

Sometimes a controller needs to listen for events dispatched on the global `window` or `document` objects.

You can append `@window` or `@document` to the event name in an action descriptor to install the event listener on `window` or `document`, respectively, as in the following example:

<meta data-controller="callout" data-callout-value="resize@window">

```html
<div data-controller="gallery"
     data-action="resize@window->gallery#layout">
  …
</div>
```

### Options

Sometimes you may need to pass [additional options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters) to the _Event Listener_ attached to the action. 

* Options are set by adding one of the allowed tokens to the end of the _action descriptor_ 
* Options are separated from the method by a column `:`
* Add an exclamation mark `!` before a token to negate its value

**The followng option tokens are allowed:**

Tokens        | EventListener option 
------------- | ---------------------
`capture`     | `{ capture: true }`
`once`        | `{ once: true }`
`passive`     | `{ passive: true }`
`!passive`    | `{ passive: false }`


**Options can be combined if needed**

`click->controller#method:!passive:once` 

## Event Objects

An _action method_ is the method in a controller which serves as an action's event listener.

The first argument to an action method is the DOM _event object_. You may want access to the event for a number of reasons, including:

* to read the key code from a keyboard event
* to read the coordinates of a mouse event
* to read data from an input event
* to prevent the browser's default behavior for an event
* to find out which element dispatched an event before it bubbled up to this action

The following basic properties are common to all events:

Event Property      | Value
------------------- | -----
event.type          | The name of the event (e.g. `"click"`)
event.target        | The target that dispatched the event (i.e. the innermost element that was clicked)
event.currentTarget | The target on which the event listener is installed (either the element with the `data-action` attribute, or `document` or `window`)

<br>The following event methods give you more control over how events are handled:

Event Method            | Result
----------------------- | ------
event.preventDefault()  | Cancels the event's default behavior (e.g. following a link or submitting a form)
event.stopPropagation() | Stops the event before it bubbles up to other listeners on parent elements

## Multiple Actions

The `data-action` attribute's value is a space-separated list of action descriptors.

It's common for any given element to have many actions. For example, the following input element calls a `field` controller's `highlight()` method when it gains focus, and a `search` controller's `update()` method every time the element's value changes:

<meta data-controller="callout" data-callout-value="focus->field#highlight">
<meta data-controller="callout" data-callout-value="input->search#update">

```html
<input type="text" data-action="focus->field#highlight input->search#update">
```

When an element has more than one action for the same event, Stimulus invokes the actions from left to right in the order that their descriptors appear.

## Naming Conventions

Always use camelCase to specify action names, since they map directly to methods on your controller.

Avoid action names that simply repeat the event's name, such as `click`, `onClick`, or `handleClick`:

<meta data-controller="callout" data-callout-value="#click" data-callout-class="avoid">

```html
<button data-action="click->profile#click">Don't</button>
```

Instead, name your action methods based on what will happen when they're called:

<meta data-controller="callout" data-callout-value="#showDialog" data-callout-class="prefer">

```html
<button data-action="click->profile#showDialog">Do</button>
```

This will help you reason about the behavior of a block of HTML without having to look at the controller source.
