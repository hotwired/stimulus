---
permalink: /handbook/working-with-external-resources.html
order: 06
---

# Working With External Resources

In the last chapter we learned how to load and persist a controller's internal state using values.

Sometimes our controllers need to track the state of external resources, where by _external_ we mean anything that isn't in the DOM or a part of Stimulus. For example, we may need to issue an HTTP request and respond as the request's state changes. Or we may want to start a timer and then stop it when the controller is no longer connected. In this chapter we'll see how to do both of those things.

## Asynchronously Loading HTML

Let's learn how to populate parts of a page asynchronously by loading and inserting remote fragments of HTML. We use this technique in Basecamp to keep our initial page loads fast, and to keep our views free of user-specific content so they can be cached more effectively.

We'll build a general-purpose content loader controller which populates its element with HTML fetched from the server. Then we'll use it to load a list of unread messages like you'd see in an email inbox.

Begin by sketching the inbox in `public/index.html`:

```html
<div data-controller="content-loader"
     data-content-loader-url-value="/messages.html"></div>
```

Then create a new `public/messages.html` file with some HTML for our message list:

```html
<ol>
  <li>New Message: Stimulus Launch Party</li>
  <li>Overdue: Finish Stimulus 1.0</li>
</ol>
```

(In a real application you'd generate this HTML dynamically on the server, but for demonstration purposes we'll just use a static file.)

Now we can implement our controller:

```js
// src/controllers/content_loader_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { url: String }

  connect() {
    this.load()
  }

  load() {
    fetch(this.urlValue)
      .then(response => response.text())
      .then(html => this.element.innerHTML = html)
  }
}
```

When the controller connects, we kick off a [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) request to the URL specified in the element's `data-content-loader-url-value` attribute. Then we load the returned HTML by assigning it to our element's `innerHTML` property.

Open the network tab in your browser's developer console and reload the page. You'll see a request representing the initial page load, followed by our controller's subsequent request to `messages.html`.

## Refreshing Automatically With a Timer

Let's improve our controller by changing it to periodically refresh the inbox so it's always up-to-date.

We'll use the `data-content-loader-refresh-interval-value` attribute to specify how often the controller should reload its contents, in milliseconds:

```html
<div data-controller="content-loader"
     data-content-loader-url-value="/messages.html"
     data-content-loader-refresh-interval-value="5000"></div>
```

Now we can update the controller to check for the interval and, if present, start a refresh timer.

Add a `static values` definition to the controller, and define a new method `startRefreshing()`:

```js
export default class extends Controller {
  static values = { url: String, refreshInterval: Number }

  startRefreshing() {
    setInterval(() => {
      this.load()
    }, this.refreshIntervalValue)
  }

  // …
}
```

Then update the `connect()` method to call `startRefreshing()` if an interval value is present:

```js
  connect() {
    this.load()

    if (this.hasRefreshIntervalValue) {
      this.startRefreshing()
    }
  }
```

Reload the page and observe a new request once every five seconds in the developer console. Then make a change to `public/messages.html` and wait for it to appear in the inbox.

## Releasing Tracked Resources

We start our timer when the controller connects, but we never stop it. That means if our controller's element were to disappear, the controller would continue to issue HTTP requests in the background.

We can fix this issue by modifying our `startRefreshing()` method to keep a reference to the timer:

```js
  startRefreshing() {
    this.refreshTimer = setInterval(() => {
      this.load()
    }, this.refreshIntervalValue)
  }
```

Then we can add a corresponding `stopRefreshing()` method below to cancel the timer:

```js
  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
```

Finally, to instruct Stimulus to cancel the timer when the controller disconnects, we'll add a `disconnect()` method:

```js
  disconnect() {
    this.stopRefreshing()
  }
```

Now we can be sure a content loader controller will only issue requests when it's connected to the DOM.

Let's take a look at our final controller class:

```js
// src/controllers/content_loader_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { url: String, refreshInterval: Number }

  connect() {
    this.load()

    if (this.hasRefreshIntervalValue) {
      this.startRefreshing()
    }
  }

  disconnect() {
    this.stopRefreshing()
  }

  load() {
    fetch(this.urlValue)
      .then(response => response.text())
      .then(html => this.element.innerHTML = html)
  }

  startRefreshing() {
    this.refreshTimer = setInterval(() => {
      this.load()
    }, this.refreshIntervalValue)
  }

  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
}
```

## Using action parameters

If we wanted to make the loader work with multiple different sources, we could do it using action parameters. Take this HTML:

```html
<div data-controller="content-loader">
  <a href="#" data-content-loader-url-param="/messages.html" data-action="content-loader#load">Messages</a>
  <a href="#" data-content-loader-url-param="/comments.html" data-action="content-loader#load">Comments</a>
</div>
```

Then we can use those parameters through the `load` action:

```js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  load({ params }) {
    fetch(params.url)
      .then(response => response.text())
      .then(html => this.element.innerHTML = html)
  }
}
```

We could even destruct the params to just get the URL parameter:

```js
  load({ params: { url } }) {
    fetch(url)
      .then(response => response.text())
      .then(html => this.element.innerHTML = html)
  }
```

## Wrap-Up and Next Steps

In this chapter we've seen how to acquire and release external resources using Stimulus lifecycle callbacks.

Next we'll see how to install and configure Stimulus in your own application.
