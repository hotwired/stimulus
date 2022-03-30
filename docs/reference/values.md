---
permalink: /reference/values.html
order: 04
---

# Values

You can read and write [HTML data attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) on controller elements as typed _values_ using special controller properties.

<meta data-controller="callout" data-callout-text-value="data-loader-url-value=&quot;/messages&quot;">

```html
<div data-controller="loader"
     data-loader-url-value="/messages">
</div>
```

<meta data-controller="callout" data-callout-text-value="static values = { url: String }">
<meta data-controller="callout" data-callout-text-value="this.urlValue">

```js
// controllers/loader_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    url: String
  }

  connect() {
    fetch(this.urlValue).then(/* … */)
  }
}
```

## Definitions

Define values in a controller using the `static values` object. Put each value's _name_ on the left and its _type_ on the right.

```js
export default class extends Controller {
  static values = {
    url: String,
    interval: Number,
    params: Object
  }

  // …
}
```

## Types

A value's type is one of `Array`, `Boolean`, `Number`, `Object`, or `String`. The type determines how the value is transcoded between JavaScript and HTML.

Type | Encoded as… | Decoded as…
---- | ----------- | -----------
Array | `JSON.stringify(array)` | `JSON.parse(value)`
Boolean | `boolean.toString()` | `!(value == "0" \|\| value == "false")`
Number | `number.toString()` | `Number(value)`
Object | `JSON.stringify(object)` | `JSON.parse(value)`
String | Itself | Itself

## Properties and Attributes

Stimulus automatically generates getter, setter, and existential properties for each value defined in a controller. These properties are linked to data attributes on the controller's element:

Kind | Property name | Effect
---- | ------------- | ------
Getter | `this.[name]Value` | Reads `data-[identifier]-[name]-value`
Setter | `this.[name]Value=` | Writes `data-[identifier]-[name]-value`
Existential | `this.has[Name]Value` | Tests for `data-[identifier]-[name]-value`

### Getters

The getter for a value decodes the associated data attribute into an instance of the value's type.

If the data attribute is missing from the controller's element, the getter returns a _default value_, depending on the value's type:

Type | Default value
---- | -------------
Array | `[]`
Boolean | `false`
Number | `0`
Object | `{}`
String | `""`

### Setters

The setter for a value sets the associated data attribute on the controller's element.

To remove the data attribute from the controller's element, assign `undefined` to the value.

### Existential Properties

The existential property for a value evaluates to `true` when the associated data attribute is present on the controller's element and `false` when it is absent.

## Change Callbacks

Value _change callbacks_ let you respond whenever a value's data attribute changes.

Define a method `[name]ValueChanged` in the controller, where `[name]` is the name of the value you want to observe for changes. The method receives its decoded value as the first argument and the decoded previous value as the second argument.

Stimulus invokes each change callback after the controller is initialized and again any time its associated data attribute changes. This includes changes as a result of assignment to the value's setter.

```js
export default class extends Controller {
  static values = { url: String }

  urlValueChanged() {
    fetch(this.urlValue).then(/* … */)
  }
}
```

### Previous Values

You can access the previous value of a `[name]ValueChanged` callback by defining the callback method with two arguments in your controller.

```js
export default class extends Controller {
  static values = { url: String }

  urlValueChanged(value, previousValue) {
    /* … */
  }
}
```

The two arguments can be named as you like. You could also use `urlValueChanged(current, old)`.

## Default Values

Values that have not been specified on the controller element can be set by defaults specified in the controller definition:

```js
export default class extends Controller {
  static values = {
    url: { type: String, default: '/bill' },
    interval: { type: Number, default: 5 },
    clicked: Boolean
  }
}
```

When a default is used, the expanded form of `{ type, default }` is used. This form can be mixed with the regular form that does not use a default.

## Naming Conventions

Write value names as camelCase in JavaScript and kebab-case in HTML. For example, a value named `contentType` in the `loader` controller will have the associated data attribute `data-loader-content-type-value`.
