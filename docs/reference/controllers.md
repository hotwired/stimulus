---
permalink: /reference/controllers
redirect_from: /reference/
order: 00
---

# Controllers

A _controller_ is the basic organizational unit of a Stimulus application.

```js
import { Controller } from "stimulus"

export default class extends Controller {
  // …
}
```

Controllers are instances of JavaScript classes that you define in your application. Each controller class inherits from the `Controller` base class exported by the `stimulus` module.

## Properties

Every controller belongs to a Stimulus `Application` instance and is associated with an HTML element. Within a controller class, you can access the controller's:

* application, via the `this.application` property
* HTML element, via the `this.element` property

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

If you use Stimulus with the `@stimulus/webpack-helpers` package, your application will automatically load and register controller classes following the conventions above.

If you don't use the webpack helpers, your application must manually load and register each controller class.

### Registering Controllers Manually

To manually register a controller class with an identifier, first import the class, then call the `Application#register` method on your application object:

```js
import ReferenceController from "./controllers/reference_controller"

application.register("reference", ReferenceController)
```

You can also register a controller class inline instead of importing it from a module:

```js
import { Controller } from "stimulus"

application.register("reference", class extends Controller {
  // …
})
```
