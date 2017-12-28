#### [<img src="assets/logo.svg" width="12" height="12" alt="Stimulus">](README.md) [Stimulus](README.md)

---

# Installation Guide

To install Stimulus, add the [stimulus npm package](https://www.npmjs.com/package/stimulus) to your application's JavaScript bundle **or** load [`stimulus.umd.js`](https://unpkg.com/stimulus/dist/stimulus.umd.js) in a `<script>` tag.

## Using webpack

Stimulus integrates with the [webpack](https://webpack.js.org/) asset packager to automatically load controller files from a folder in your app. Name your controller files by following the convention `[identifier]_controller.js` where `identifier` corresponds to each controller's `data-controller` value in your HTML. Create a [webpack `require.context`](https://webpack.js.org/api/module-methods/#require-context) for your controllers and pass it to the `autoload` helper along with your application instance.

```js
// src/application.js
import { Application } from "stimulus"
import { autoload } from "stimulus/webpack-helpers"

const application = Application.start()
const controllers = require.context("./controllers", true, /\.js$/)
autoload(controllers, application)
```

## Using Other Build Systems

Stimulus works with all other build systems too, but without support for controller auto-loading. Controller files need to be explicitly loaded and registered with your application instance.

```js
// src/application.js
import { Application } from "stimulus"

import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

const application = Application.start()
application.register("hello", HelloController)
application.register("clipboard", ClipboardController)
```

## Using Without a Build System

Load Stimulus in a `<script>` tag to make it globally available as `window.Stimulus`.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/stimulus/dist/stimulus.umd.js"></script>
  <script>
    (function() {
      const application = Stimulus.Application.start()
      application.register("hello", class extends Stimulus.Controller {
        …
      })
    })()
  </script>
<head>
<body>
  <div data-controller="hello">…</div>
</body>
</html>
```

## Browser Support

Stimulus supports all evergreen, self-updating desktop and mobile browsers out of the box. If your application needs to support older browsers, include polyfills for `Array.from()`, `Element.closest()`, `Map`, `Object.assign()`, `Promise`, and `Set` before loading Stimulus.

Stimulus is known to support Internet Explorer 11+ and Safari 9+ using [these polyfills](https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/polyfills/index.js) from [core-js](https://www.npmjs.com/package/core-js) and [element-closest](https://www.npmjs.com/package/element-closest) respectively.
