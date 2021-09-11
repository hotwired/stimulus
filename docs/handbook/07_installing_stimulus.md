---
permalink: /handbook/installing
---

# Installing Stimulus in Your Application
{:.no_toc}

To install Stimulus in your application, add the [`@hotwired/stimulus` npm package](https://www.npmjs.com/package/@hotwired/stimulus) to your JavaScript bundle. Or, import [`stimulus.esm.js`](https://unpkg.com/@hotwired/stimulus/dist/stimulus.js) in a `<script type="module">` tag.

* TOC
{:toc}

## Using stimulus-rails

Stimulus integrates with the [stimulus-rails](https://github.com/hotwired/stimulus-rails) to automatically load controller files from a folder in your app, if you're using it together with import maps.

### Controller Filenames Map to Identifiers

Name your controller files `[identifier]_controller.js`, where `identifier` corresponds to each controller's `data-controller` identifier in your HTML.

Stimulus conventionally separates multiple words in filenames using underscores. Each underscore in a controller's filename translates to a dash in its identifier.

You may also namespace your controllers using subfolders. Each forward slash in a namespaced controller file's path becomes two dashes in its identifier.

If you prefer, you may use dashes instead of underscores anywhere in a controller's filename. Stimulus treats them identically.

If your controller file is named… | its identifier will be…
--------------------------------- | -----------------------
clipboard_controller.js           | clipboard
date_picker_controller.js         | date-picker
users/list_item_controller.js     | users\-\-list-item
local-time-controller.js          | local-time

## Using Other Build Systems

Stimulus works with other build systems, too, but without support for controller autoloading. Instead, you must explicitly load and register controller files with your application instance:

```js
// src/application.js
import { Application } from "@hotwired/stimulus"

import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

window.Stimulus = Application.start()
Stimulus.register("hello", HelloController)
Stimulus.register("clipboard", ClipboardController)
```

## Using Without a Build System

If you prefer not to use a build system, you can load Stimulus in a `<script type="module">` tag:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module" src=""></script>
  <script type="module">
    import { Application, Controller } from "@hotwired/stimulus"
    window.Stimulus = Application.start()

    Stimulus.register("hello", class extends Controller {
      static targets = [ "name" ]

      connect() {
      }
    })
  </script>
</head>
<body>
  <div data-controller="hello">
    <input data-hello-target="name" type="text">
    …
  </div>
</body>
</html>
```

## Browser Support

Stimulus supports all evergreen, self-updating desktop and mobile browsers out of the box. Stimulus 3+ does not support Internet Explorer 11 (but you can use Stimulus 2 with the @stimulus/polyfills for that).


## Error handling

All calls from Stimulus to your application's code are wrapped in a `try ... catch` block.

If your code throws an error, it will be caught by Stimulus and logged to the browser console, including extra detail such as the controller name and event or lifecycle function being called. If you use an error tracking system that defines `window.onerror`, Stimulus will also pass the error on to it.

You can override how Stimulus handles errors by defining `Application#handleError`:

```js
// src/application.js
import { Application } from "@hotwired/stimulus"
window.Stimulus = Application.start()

Stimulus.handleError = (error, message, detail) => {
  console.warn(message, detail)
  ErrorTrackingSystem.captureException(error)
}
```
