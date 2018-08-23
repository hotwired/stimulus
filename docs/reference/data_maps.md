---
permalink: /reference/data-maps
order: 04
---

# Data Maps

Each Stimulus controller has a _data map_ which lets you access special data attributes on the controller's element.

<meta data-controller="callout" data-callout-value="data-content-loader-url=&quot;/messages&quot;">

```html
<div data-controller="content-loader"
     data-content-loader-url="/messages">
</div>
```

<meta data-controller="callout" data-callout-value="this.data.get(&quot;url&quot;)">

```js
// controllers/content_loader_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    fetch(this.data.get("url")).then(/* … */)
  }
}
```

The data map object is exposed to each controller through its `this.data` property.

## Methods

Use the following methods in a controller to access data attributes by key:

Method                         | Result
------------------------------ | ------
this.data.get(key)             | Returns the string value of the mapped data attribute
this.data.has(key)             | Returns true if the mapped data attribute exists
this.data.set(key,&nbsp;value) | Sets the string value of the mapped data attribute
this.data.delete(key)          | Deletes the mapped data attribute

## Naming Conventions

Keys map to attribute names using the format `data-[identifier]-[key]`.

Write keys with multiple words as `camelCase` in JavaScript and `kebab-case` in HTML. For example, the following method call:

<meta data-controller="callout" data-callout-value="fileType">

```js
this.data.get("fileType")
```

will return the value `"svg"`, given the following HTML:

<meta data-controller="callout" data-callout-value="file-type">

```html
<div data-controller="reference" data-reference-file-type="svg">
```

## Values Are Strings

Attribute values are always represented as strings, so if you pass the number `1` to `DataMap#set()`:

```js
this.data.set("count", 1)
```

then you'll get the string `"1"` back from `DataMap#get()`:

```js
this.data.get("count") // "1"
```
