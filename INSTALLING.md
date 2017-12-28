#### [<img src="assets/logo.svg" width="12" height="12" alt="Stimulus">](README.md) [Stimulus](README.md)

---

# Installation Guide

### Using Webpack

```
$ npm install stimulus
$ mkdir -p src/controllers
```

```js
// src/application.js
import { Application } from "stimulus"
import { autoload } from "stimulus/webpack-helpers"

const application = Application.start()
autoload(require.context("./controllers", true, /\.js$/), application)
```

### Using Without a Build System

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/stimulus/dist/stimulus.umd.js"></script>
```

```js
(function() {
  const application = Stimulus.Application.start()
  application.register("hello", class extends Stimulus.Controller {
    // ...
  })
})()
```
