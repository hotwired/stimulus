---
permalink: /reference/controllers.html
order: 00
---

# Controllers

A _controller_ is the basic organizational unit of a Stimulus application.

```js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // …
}
```

Controllers are instances of JavaScript classes that you define in your application. Each controller class inherits from the `Controller` base class exported by the `@hotwired/stimulus` module.

## Properties

Every controller belongs to a Stimulus `Application` instance and is associated with an HTML element. Within a controller class, you can access the controller's:

* application, via the `this.application` property
* HTML element, via the `this.element` property
* identifier, via the `this.identifier` property

## Modules

Define your controller classes in JavaScript modules, one per file. Export each controller class as the module's default object, as in the example above.

Place these modules in the `controllers/` directory. Name the files `[identifier]_controller.js`, where `[identifier]` corresponds to each controller's identifier.

## Identifiers

An _identifier_ is the name you use to reference a controller class in HTML.

When you add a `data-controller` attribute to an element, Stimulus reads the identifier from the attribute's value and creates a new instance of the corresponding controller class.

For example, this element has a controller which is an instance of the class defined in `controllers/reference_controller.js`:

<meta data-controller="callout" data-callout-text-value="reference">

```html
<div data-controller="reference"></div>
```

The following is an example of how Stimulus will generate identifiers for controllers in it's require context:

If your controller file is named… | its identifier will be…
--------------------------------- | -----------------------
clipboard_controller.js           | clipboard
date_picker_controller.js         | date-picker
users/list_item_controller.js     | users\-\-list-item
local-time-controller.js          | local-time

## Scopes

When Stimulus connects a controller to an element, that element and all of its children make up the controller's _scope_.

For example, the `<div>` and `<h1>` below are part of the controller's scope, but the surrounding `<main>` element is not.

```html
<main>
  <div data-controller="reference">
    <h1>Reference</h1>
  </div>
</main>
```

## Nested Scopes

When nested, each controller is only aware of its own scope excluding the scope of any controllers nested within.

For example, the `#parent` controller below is only aware of the `item` targets directly within its scope, but not any targets of the `#child` controller.

```html
<ul id="parent" data-controller="list">
  <li data-list-target="item">One</li>
  <li data-list-target="item">Two</li>
  <li>
    <ul id="child" data-controller="list">
      <li data-list-target="item">I am</li>
      <li data-list-target="item">a nested list</li>
    </ul>
  </li>
</ul>
```

## Multiple Controllers

The `data-controller` attribute's value is a space-separated list of identifiers:

<meta data-controller="callout" data-callout-text-value="clipboard">
<meta data-controller="callout" data-callout-text-value="list-item">

```html
<div data-controller="clipboard list-item"></div>
```

It's common for any given element on the page to have many controllers. In the example above, the `<div>` has two connected controllers, `clipboard` and `list-item`.

Similarly, it's common for multiple elements on the page to reference the same controller class:

<meta data-controller="callout" data-callout-text-value="list-item">

```html
<ul>
  <li data-controller="list-item">One</li>
  <li data-controller="list-item">Two</li>
  <li data-controller="list-item">Three</li>
</ul>
```

Here, each `<li>` has its own instance of the `list-item` controller.

## Naming Conventions

Always use camelCase for method and property names in a controller class.

When an identifier is composed of more than one word, write the words in kebab-case (i.e., by using dashes: `date-picker`, `list-item`).

In filenames, separate multiple words using either underscores or dashes (snake_case or kebab-case: `controllers/date_picker_controller.js`, `controllers/list-item-controller.js`).

## Registration

If you use Stimulus for Rails with an import map or Webpack together with the `@hotwired/stimulus-webpack-helpers` package, your application will automatically load and register controller classes following the conventions above.

If not, your application must manually load and register each controller class.

### Registering Controllers Manually

To manually register a controller class with an identifier, first import the class, then call the `Application#register` method on your application object:

```js
import ReferenceController from "./controllers/reference_controller"

application.register("reference", ReferenceController)
```

You can also register a controller class inline instead of importing it from a module:

```js
import { Controller } from "@hotwired/stimulus"

application.register("reference", class extends Controller {
  // …
})
```

### Preventing Registration Based On Environmental Factors

If you only want a controller registered and loaded if certain environmental factors are met – such a given user agent – you can overwrite the static `shouldLoad` method:

```js
class UnloadableController extends ApplicationController {
  static get shouldLoad() {
    return false
  }
}

// This controller will not be loaded
application.register("unloadable", UnloadableController)
```

## Cross-Controller Coordination With Events

If you need controllers to communicate with each other, you should use events. The `Controller` class has a convenience method called `dispatch` that makes this easier. It takes an `eventName` as the first argument, which is then automatically prefixed with the name of the controller separated by a colon. The payload is held in `detail`. It works like this:

```js
class ClipboardController extends Controller {
  static targets = [ "source" ]

  copy() {
    this.dispatch("copy", { detail: { content: this.sourceTarget.value } })
    navigator.clipboard.writeText(this.sourceTarget.value)
  }
}
```

And this event can then be routed to an action on another controller:

```html
<div data-controller="clipboard effects" data-action="clipboard:copy->effects#flash">
  PIN: <input data-clipboard-target="source" type="text" value="1234" readonly>
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

So when the `Clipboard#copy` action is invoked, the `Effects#flash` action will be too:

```js
class EffectsController extends Controller {
  flash({ detail: { content } }) {
    console.log(content) // 1234
  }
}
```

`dispatch` accepts additional options as the second parameter as follows:

option       | default            | notes
-------------|--------------------|----------------------------------------------------------------------------------------------
`detail`     | `{}` empty object  | See [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
`target`     | `this.element`     | See [Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)
`prefix`     | `this.identifier`  | If the prefix is falsey (e.g. `null` or `false`), only the `eventName` will be used. If you provide a string value the `eventName` will be prepended with the provided string and a colon. 
`bubbles`    | `true`             | See [Event.bubbles](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles)
`cancelable` | `true`             | See [Event.cancelable](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable)

`dispatch` will return the generated [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent), you can use this to provide a way for the event to be cancelled by any other listeners as follows:

```js
class ClipboardController extends Controller {
  static targets = [ "source" ]

  copy() {
    const event = this.dispatch("copy", { cancelable: true })
    if (event.defaultPrevented) return
    navigator.clipboard.writeText(this.sourceTarget.value)
  }
}
```

```js
class EffectsController extends Controller {
  flash(event) {
    // this will prevent the default behaviour as determined by the dispatched event
    event.preventDefault()
  }
}
```

## Directly Invoking Other Controllers

If for some reason it is not possible to use events to communicate between controllers, you can reach a controller instance via the `getControllerForElementAndIdentifier` method from the application. This should only be used if you have a unique problem that cannot be solved through the more general way of using events, but if you must, this is how:

```js
class MyController extends Controller {
  static targets = [ "other" ]

  copy() {
    const otherController = this.application.getControllerForElementAndIdentifier(this.otherTarget, 'other')
    otherController.otherMethod()
  }
}
```
