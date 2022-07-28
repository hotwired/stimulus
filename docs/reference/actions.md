---
permalink: /reference/actions.html
order: 02
---

# Actions

_Actions_ are how you handle DOM events in your controllers.

<meta data-controller="callout" data-callout-text-value="click->gallery#next">

```html
<div data-controller="gallery">
  <button data-action="click->gallery#next">…</button>
</div>
```

<meta data-controller="callout" data-callout-text-value="next">

```js
// controllers/gallery_controller.js
import { Controller } from "@hotwired/stimulus"

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

<meta data-controller="callout" data-callout-text-value="gallery#next">

```html
<button data-action="gallery#next">…</button>
```

The full set of these shorthand pairs is as follows:

Element           | Default Event
----------------- | -------------
a                 | click
button            | click
details           | toggle
form              | submit
input             | input
input type=submit | click
select            | change
textarea          | input

### Global Events

Sometimes a controller needs to listen for events dispatched on the global `window` or `document` objects.

You can append `@window` or `@document` to the event name in an action descriptor to install the event listener on `window` or `document`, respectively, as in the following example:

<meta data-controller="callout" data-callout-text-value="resize@window">

```html
<div data-controller="gallery"
     data-action="resize@window->gallery#layout">
</div>
```

### Options

You can append one or more _action options_ to an action descriptor if you need to specify [DOM event listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters).

<meta data-controller="callout" data-callout-text-value=":!passive">
<meta data-controller="callout" data-callout-text-value=":capture">

```html
<div data-controller="gallery"
     data-action="scroll->gallery#layout:!passive">
  <img data-action="click->gallery#open:capture">
```

Stimulus supports the following action options:

Action option | DOM event listener option
------------- | -------------------------
`:capture`    | `{ capture: true }`
`:once`       | `{ once: true }`
`:passive`    | `{ passive: true }`
`:!passive`   | `{ passive: false }`

On top of that, Stimulus also supports the following action options which are not natively supported by the DOM event listener options:

Custom action option | Description
-------------------- | -----------
`:stop`              | calls `.stopPropagation()` on the event before invoking the method
`:prevent`           | calls `.preventDefault()` on the event before invoking the method
`:self`              | only invokes the method if the event was fired by the element itself

You can register your own action options with the `Application.registerActionOption` method.

For example, consider that a `<details>` element will dispatch a [toggle][]
event whenever it's toggled. A custom `:open` action option would help
to route events whenever the element is toggled _open_:

```javascript
import { Application } from "@hotwired/stimulus"

const application = Application.start()

application.registerActionOption("open", ({ event }) => {
  if (event.type == "toggle") {
    return event.target.open == true
  } else {
    return true
  }
})
```

Similarly, a custom `:!open` action option could route events whenever the
element is toggled _closed_. Declaring the action descriptor option with a `!`
prefix will yield a `value` argument set to `false` in the callback:

```javascript
import { Application } from "@hotwired/stimulus"

const application = Application.start()

application.registerActionOption("open", ({ event, value }) => {
  if (event.type == "toggle") {
    return event.target.open == value
  } else {
    return true
  }
})
```

In order to prevent the event from being routed to the controller action, the
`registerActionOption` callback function must return `false`. Otherwise, to
route the event to the controller action, return `true`.

The callback accepts a single object argument with the following keys:

Name    | Description
--------|------------
name    | String: The option's name (`"open"` in the example above)
value   | Boolean: The value of the option (`:open` would yield `true`, `:!open` would yield `false`)
event   | [Event][]: The event instance
element | [Element]: The element where the action descriptor is declared

[toggle]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event
[Event]: https://developer.mozilla.org/en-US/docs/web/api/event
[Element]: https://developer.mozilla.org/en-US/docs/Web/API/element

## Event Objects

An _action method_ is the method in a controller which serves as an action's event listener.

The first argument to an action method is the DOM _event object_. You may want access to the event for a number of reasons, including:

* to read the key code from a keyboard event
* to read the coordinates of a mouse event
* to read data from an input event
* to read params from the action submitter element
* to prevent the browser's default behavior for an event
* to find out which element dispatched an event before it bubbled up to this action

The following basic properties are common to all events:

Event Property      | Value
------------------- | -----
event.type          | The name of the event (e.g. `"click"`)
event.target        | The target that dispatched the event (i.e. the innermost element that was clicked)
event.currentTarget | The target on which the event listener is installed (either the element with the `data-action` attribute, or `document` or `window`)
event.params        | The action params passed by the action submitter element

<br>The following event methods give you more control over how events are handled:

Event Method            | Result
----------------------- | ------
event.preventDefault()  | Cancels the event's default behavior (e.g. following a link or submitting a form)
event.stopPropagation() | Stops the event before it bubbles up to other listeners on parent elements

## Multiple Actions

The `data-action` attribute's value is a space-separated list of action descriptors.

It's common for any given element to have many actions. For example, the following input element calls a `field` controller's `highlight()` method when it gains focus, and a `search` controller's `update()` method every time the element's value changes:

<meta data-controller="callout" data-callout-text-value="focus->field#highlight">
<meta data-controller="callout" data-callout-text-value="input->search#update">

```html
<input type="text" data-action="focus->field#highlight input->search#update">
```

When an element has more than one action for the same event, Stimulus invokes the actions from left to right in the order that their descriptors appear.

The action chain can be stopped at any point by calling `Event#stopImmediatePropagation()` within an action. Any additional actions to the right will be ignored:

```javascript
highlight: function(event) {
  event.stopImmediatePropagation()
  // ...
}
```

## Naming Conventions

Always use camelCase to specify action names, since they map directly to methods on your controller.

Avoid action names that simply repeat the event's name, such as `click`, `onClick`, or `handleClick`:

<meta data-controller="callout" data-callout-text-value="#click" data-callout-type-value="avoid">

```html
<button data-action="click->profile#click">Don't</button>
```

Instead, name your action methods based on what will happen when they're called:

<meta data-controller="callout" data-callout-text-value="#showDialog" data-callout-type-value="prefer">

```html
<button data-action="click->profile#showDialog">Do</button>
```

This will help you reason about the behavior of a block of HTML without having to look at the controller source.

## Action Parameters

Actions can have parameters that are be passed from the submitter element. They follow the format of `data-[identifier]-[param-name]-param`. Parameters must be specified on the same element as the action they intend to be passed to is declared.

All parameters are automatically typecast to either a `Number`, `String`, `Object`, or `Boolean`, inferred by their value:

Data attribute                                  | Param                | Type
----------------------------------------------- | -------------------- | --------
`data-item-id-param="12345"`                    | `12345`              | Number
`data-item-url-param="/votes"`                  | `"/votes"`           | String
`data-item-payload-param='{"value":"1234567"}'` | `{ value: 1234567 }` | Object
`data-item-active-param="true"`                 | `true`               | Boolean


<br>Consider this setup:

```html
<div data-controller="item spinner">
  <button data-action="item#upvote spinner#start" 
    data-item-id-param="12345" 
    data-item-url-param="/votes"
    data-item-payload-param='{"value":"1234567"}' 
    data-item-active-param="true">…</button>
</div>
```

It will call both `ItemController#upvote` and `SpinnerController#start`, but only the former will have any parameters passed to it:

```js
// ItemController
upvote(event) {
  // { id: 12345, url: "/votes", active: true, payload: { value: 1234567 } }
  console.log(event.params) 
}

// SpinnerController
start(event) {
  // {}
  console.log(event.params) 
}
```

If we don't need anything else from the event, we can destruct the params:

```js
upvote({ params }) {
  // { id: 12345, url: "/votes", active: true, payload: { value: 1234567 } }
  console.log(params) 
}
```

Or destruct only the params we need, in case multiple actions on the same controller share the same submitter element:

```js
upvote({ params: { id, url } }) {
  console.log(id) // 12345
  console.log(url) // "/votes"
}
```
