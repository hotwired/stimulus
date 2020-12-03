---
permalink: /handbook/installing
---

# Installing Stimulus in Your Application
{:.no_toc}

To install Stimulus in your application, add the [`stimulus` npm package](https://www.npmjs.com/package/stimulus) to your JavaScript bundle. Or, load [`stimulus.umd.js`](https://unpkg.com/stimulus/dist/stimulus.umd.js) in a `<script>` tag.

* TOC
{:toc}

## Using webpack

Stimulus integrates with the [webpack](https://webpack.js.org/) asset packager to automatically load controller files from a folder in your app.

Call webpack's [`require.context`](https://webpack.js.org/api/module-methods/#require-context) helper with the path to the folder containing your Stimulus controllers. Then, pass the resulting context to the `Application#load` method using the `definitionsFromContext` helper:

```js
// src/application.js
import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start()
const context = require.context("./controllers", true, /\.js$/)
application.load(definitionsFromContext(context))
```

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
import { Application } from "stimulus"

import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

const application = Application.start()
application.register("hello", HelloController)
application.register("clipboard", ClipboardController)
```

## Using Babel

If you're using [Babel](https://babeljs.io/) with your build system, you'll need to add the [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) plugin to your configuration:

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

Or, by enabling the [`shippedPropsals`](https://babeljs.io/docs/en/babel-preset-env#shippedproposals) option with [Babel `^7.10.0`](https://babeljs.io/blog/2020/05/25/7.10.0):

```json
{
  "presets": [["@babel/preset-env", { "shippedProposals": true }]]
}
```

## Using Without a Build System

If you prefer not to use a build system, you can load Stimulus in a `<script>` tag and it will be globally available through the `window.Stimulus` object.

Define targets using `static get targets()` methods instead of `static targets = […]` class properties, which aren't supported natively [yet](https://github.com/tc39/proposal-static-class-features/).

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/stimulus/dist/stimulus.umd.js"></script>
  <script>
    (() => {
      const application = Stimulus.Application.start()

      application.register("hello", class extends Stimulus.Controller {
        static get targets() {
          return [ "name" ]
        }

        // …
      })
    })()
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

Stimulus supports all evergreen, self-updating desktop and mobile browsers out of the box.

If your application needs to support older browsers like Internet Explorer 11, include the [`@stimulus/polyfills`](https://www.npmjs.com/package/@stimulus/polyfills) package before loading Stimulus.

```js
import "@stimulus/polyfills"
import { Application } from "stimulus"

const application = Application.start()
// …
```
