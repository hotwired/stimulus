---
slug: /working-with-external-resources
---

# Working With External Resources

In the last chapter we learned how to load and persist a controller's internal state using the Data API.

Sometimes our controllers need to track the state of external resources, where by _external_ we mean anything that isn't in the DOM or a part of Stimulus. For example, we may need to issue an HTTP request and respond as the request's state changes. Or we may want to start a timer and then stop it when the controller is no longer connected. In this chapter we'll see how to do both of those things.

## Asynchronously Loading HTML

Let's learn how to populate parts of a page asynchronously by loading and inserting remote fragments of HTML. We use this technique in Basecamp to keep our initial page loads fast, and to keep our views free of user-specific content so they can be cached more effectively.

We'll build a general-purpose content loader controller which populates its element with HTML fetched from the server. Then we'll use it to load a list of unread messages like you'd see in an email inbox.

Begin by sketching the inbox in `public/index.html`:

```html
<div data-controller="content-loader"
     data-content-loader-url="/messages.html"></div>
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
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.load()
  }

  load() {
    fetch(this.data.get("url"))
      .then(response => response.text())
      .then(html => {
        this.element.innerHTML = html
      })
  }
}
```

When the controller connects, we kick off a [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) request to the URL specified in the element's `data-content-loader-url` attribute. Then we load the returned HTML by assigning it to our element's `innerHTML` property.

Open the network tab in your browser's developer console and reload the page. You'll see an initial full page request to `index.html`, followed by our controller's subsequent request to `messages.html`.

## Refreshing Automatically With a Timer

Let's improve our controller by changing it to periodically refresh the inbox so it's always up-to-date.

We'll use the `data-content-loader-refresh-interval` attribute to specify how often the controller should reload its contents, in milliseconds:

```html
<div data-controller="content-loader"
     data-content-loader-url="/messages.html"
     data-content-loader-refresh-interval="5000"></div>
```

Now we can update the controller to check for the interval and, if present, start a refresh timer:

```js
  connect() {
    this.load()

    if (this.data.has("refreshInterval")) {
      this.startRefreshing()
    }
  }

  startRefreshing() {
    setInterval(() => {
      this.load()
    }, this.data.get("refreshInterval"))
  }
}
```

Reload the page and observe a new request once every five seconds in the developer console. Then make a change to `public/messages.html` and wait for it to appear in the inbox.

## Releasing Tracked Resources

We start our timer when the controller connects, but we never stop it. That means if our controller's element were to disappear, the controller would continue to issue HTTP requests in the background.

We can fix this issue by modifying the `startRefreshing()` method to keep a reference to the timer. Then, in our `disconnect()` method, we can cancel it.

```js
  disconnect() {
    this.stopRefreshing()
  }

  startRefreshing() {
    this.refreshTimer = setInterval(() => {
      this.load()
    }, this.data.get("refreshInterval"))
  }

  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
}
```

Now we can be sure a content loader controller will only issue requests when it's connected to the DOM.

Let's take a look at our final controller class:

```js
// src/controllers/content_loader_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.load()

    if (this.data.has("refreshInterval")) {
      this.startRefreshing()
    }
  }

  disconnect() {
    this.stopRefreshing()
  }

  load() {
    fetch(this.data.get("url"))
      .then(response => response.text())
      .then(html => {
        this.element.innerHTML = html
      })
  }

  startRefreshing() {
    this.refreshTimer = setInterval(() => {
      this.load()
    }, this.data.get("refreshInterval"))
  }

  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
}
```

## Wrap-Up and Next Steps

In this chapter we've seen how to acquire and release external resources using Stimulus lifecycle callbacks.

Next we'll examine how to develop secure applications with Stimulus.
