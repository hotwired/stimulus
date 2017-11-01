# Stimulus ✨

Stimulus is framework for adding JavaScript behavior to your HTML. It’s a system for controlling the events and lifecycle of elements in the DOM, and a set of conventions for structuring your code. Stimulus provides just enough formality to save you from JavaScript soup.

## Installation

Include the [`stimulus` npm package](https://www.npmjs.com/package/stimulus) in your application using your preferred asset bundling tool.

Or, load the [`stimulus.umd.js`](https://unpkg.com/stimulus/dist/stimulus.umd.js) browser bundle in a `<script>` tag directly and access the API through the `window.Stimulus` global.

## Usage

* [Controllers](#controllers)
  * [Identifiers](#identifiers)
  * [Actions](#actions)
  * [Targets](#targets)
  * [Data](#data)
* [Applications](#applications)

### Controllers
```js
import { Controller } from "stimulus"

export default class DemoController extends Controller {
  initialize() {

  }

  connect() {

  }

  disconnect() {

  }
}
```

#### Identifiers

```html
<div data-controller="demo"></div>
```

#### Actions

```html
<div data-controller="demo">
  <button data-action="demo#run">Run</button>
</div>
```

```js
export default class DemoController extends Controller {
  run() {
    const message = "It works!"
    alert(message)
  }
}
```

#### Targets

```html
<div data-controller="demo">
  <input data-target="demo.message" type="text" value="It works!">
  <button data-action="demo#run">Run</button>
</div>
```

```js
export default class DemoController extends Controller {
  run() {
    const message = this.targets.find("message").value
    alert(message)
  }
}
```

#### Data

```html
<div data-controller="demo" data-demo-message="It works!">
  <button data-action="demo#run">Run</button>
</div>
```

```js
export default class DemoController extends Controller {
  run() {
    const message = this.data.get("message")
    alert(message)
  }
}
```

### Applications

```js
import { Application } from "stimulus"
import DemoController from "./controllers/demo_controller"

const application = new Application()
application.register("demo", DemoController)
application.start()
```

---

© 2017 Basecamp, LLC.
