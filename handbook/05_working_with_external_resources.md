---
slug: /working-with-external-resources
---

# Working With External Resources

In this chapter we'll learn how to populate parts of a page asynchronously using Ajax requests. This is great technique for loading user-specific content that may be slower to generate, while keeping the initial page fast and easy to cache.

Start by adding the controller's markup to `public/index.html`:

```html
<h1>Your schedule today:</h1>

<div data-controller="content-loader" data-content-loader-url="/agenda.html"></div>
```

Then add a new `public/agenda.html` page with a snippet of HTML:

```html
<ul>
  <li>9am: Breakfast</li>
  <li>1pm: Lunch</li>
  <li>7pm: Dinner</li>
</ul>
```

And now we'll start putting our controller together:

```js
// src/controllers/content_loader_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.load()
  }

  load() {
    const xhr = this.xhr = new XMLHttpRequest
    xhr.open("GET", this.url, true)
    xhr.onload = () => {
      this.content = xhr.response
    }
    xhr.send()
  }

  get url() {
    return this.data.get("url")
  }

  set content(value) {
    this.element.innerHTML = value
  }
}
```

When the element appears, Stimulus calls our `connect()` method and we kick off an Ajax request to the URL specified in the element's data attributes. When the response comes back with HTML, we populate the element with it.

## Making Network Requests Responsibly

What happens if the element is removed before its Ajax request completes? We don't want to keep a network request open that won't be used. Let's use the `disconnect()` callback to ensure that never happens by canceling the request:

```js
  disconnect() {
    this.abort()
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }
```

What happens if the element's content has already been loaded? We don't want to make *another* Ajax request. Let's use the Data API to track that state and skip making a request when we can.

```js
  connect() {
    if (!this.loaded) {
      this.load()
    }
  }

  load() {
    // …
    xhr.onload = () => {
      this.content = xhr.response
      this.loaded = true
    }
  }

  get loaded() {
    return this.data.has("loaded")
  }

  set loaded(value) {
    this.data.set("loaded", value)
  }
```

Let's take a look at our controller in complete form:

```js
// src/controllers/content_loader_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    if (!this.loaded) {
      this.load()
    }
  }

  disconnect() {
    this.abort()
  }

  load() {
    const xhr = this.xhr = new XMLHttpRequest
    xhr.open("GET", this.url, true)
    xhr.onload = () => {
      this.content = xhr.response
      this.loaded = true
    }
    xhr.send()
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }

  get url() {
    return this.data.get("url")
  }

  get loaded() {
    return this.data.has("loaded")
  }

  set loaded(value) {
    this.data.set("loaded", value)
  }

  set content(value) {
    this.element.innerHTML = value
  }
}
```
