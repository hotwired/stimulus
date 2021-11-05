---
permalink: /handbook/installing.html
order: 07
---

# Installing Stimulus in Your Application

To install Stimulus in your application, add the [`@hotwired/stimulus` npm package](https://www.npmjs.com/package/@hotwired/stimulus) to your JavaScript bundle. Or, import [`stimulus.js`](https://unpkg.com/@hotwired/stimulus/dist/stimulus.js) in a `<script type="module">` tag.

## Using Stimulus for Rails

If you're using [Stimulus for Rails](https://github.com/hotwired/stimulus-rails/) together with an [import map](https://github.com/rails/importmap-rails), the integration will automatically load all controller files from `app/javascript/controllers`.

### Controller Filenames Map to Identifiers

Name your controller files `[identifier]_controller.js`, where `identifier` corresponds to each controller's `data-controller` identifier in your HTML.

Stimulus for Rails conventionally separates multiple words in filenames using underscores. Each underscore in a controller's filename translates to a dash in its identifier.

You may also namespace your controllers using subfolders. Each forward slash in a namespaced controller file's path becomes two dashes in its identifier.

If you prefer, you may use dashes instead of underscores anywhere in a controller's filename. Stimulus treats them identically.

If your controller file is named… | its identifier will be…
--------------------------------- | -----------------------
clipboard_controller.js           | clipboard
date_picker_controller.js         | date-picker
users/list_item_controller.js     | users\-\-list-item
local-time-controller.js          | local-time

## Using Webpack Helpers

If you're using Webpack as your JavaScript bundler, you can use the [@hotwired/stimulus-webpack-helpers](https://www.npmjs.com/package/@hotwired/stimulus-webpack-helpers) package to get the same form of autoloading behavior as Stimulus for Rails. First add the package, then use it like this:

```js
import { Application } from "@hotwired/stimulus"
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers"

window.Stimulus = Application.start()
const context = require.context("./controllers", true, /\.js$/)
Stimulus.load(definitionsFromContext(context))
```

## Using Other Build Systems

Stimulus works with other build systems too, but without support for controller autoloading. Instead, you must explicitly load and register controller files with your application instance:

```js
// src/application.js
import { Application } from "@hotwired/stimulus"

import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

window.Stimulus = Application.start()
Stimulus.register("hello", HelloController)
Stimulus.register("clipboard", ClipboardController)
```

If you're using stimulus-rails with a builder like esbuild, you can use the `stimulus:manifest:update` Rake task and `./bin/rails generate stimulus [controller]` generator to keep a controller index file located at `app/javascript/controllers/index.js` automatically updated.

## Using Without a Build System

If you prefer not to use a build system, you can load Stimulus in a `<script type="module">` tag:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script type="module">
    import { Application, Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"
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

## Overriding Attribute Defaults
In case Stimulus `data-*` attributes conflict with another library in your project, they can be overridden when creating the Stimulus `Application`.

- `data-controller`
- `data-action`
- `data-target`

These core Stimulus attributes can be overridden (see: [schema.ts](https://github.com/hotwired/stimulus/blob/main/src/core/schema.ts)):

```js
// src/application.js
import { Application, defaultSchema } from "@hotwired/stimulus"

const customSchema = {
  ...defaultSchema,
  actionAttribute: 'data-stimulus-action'
}

window.Stimulus = Application.start(document.documentElement, customSchema);
```

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

## Debugging

If you've assigned your Stimulus application to `window.Stimulus`, you can turn on [debugging mode](https://github.com/hotwired/stimulus/pull/354) from the console with `Stimulus.debug = true`. You can also set this flag when you're configuring your application instance in the source code.


## Browser Support

Stimulus supports all evergreen, self-updating desktop and mobile browsers out of the box. Stimulus 3+ does not support Internet Explorer 11 (but you can use Stimulus 2 with the @stimulus/polyfills for that).
