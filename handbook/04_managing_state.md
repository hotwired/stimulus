#### [The Stimulus Handbook](README.md) is a 🚧 work in progress

---

# 4 Managing State

* Let's start by making a controller that increments a counter when you click a button
* Add this to `public/index.html`:

```html
<p data-controller="counter">
  <button data-action="counter#increment">+</button>
  <span data-target="counter.count"></span>
</p>
```

* And here's our initial controller:

```js
// src/controllers/counter_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    this.count = 0
  }

  increment() {
    this.count++
    this.renderCount()
  }

  renderCount() {
    this.targets.find("count").textContent = this.count
  }
}
```

* When the controller is initialized we set a `count` property to `0`
* Clicking the button increments `count` and updates the target element with the value
* Here it is in action:

![counter](https://user-images.githubusercontent.com/5355/34276147-1c20f558-e66e-11e7-9ae1-8ed731c65c16.gif)

* Great, it works! There's a subtle problem though.
* What happens if we make a copy of our element's HTML?
* Open your browser's JavaScript console and paste this in:

```js
document.body.innerHTML = document.body.innerHTML
```

![counter-copy](https://user-images.githubusercontent.com/5355/34276158-250cff9a-e66e-11e7-886f-5d62a74bce41.gif)

* Oops! It looks right at first, but clicking the button resets the counter
* That's because a new controller was created when we copied the HTML
* The copied HTML isn't aligned with the new controller's state
* Let's fix that by persisting the state in the DOM
* First we'll add a new data attribute to store our `count` property

```html
<p data-controller="counter" data-counter-count="0">
  <button data-action="counter#increment">+</button>
  <span data-target="counter.count"></span>
</p>
```

### Data Attributes Explained

> * `data-counter-count="0"` is a scoped data attribute
>   * `counter` is the controller's _identifier_
>   * `count` is the _key_
>   * `0` is the _value_

* Now we'll update the controller to read and write `count` using the data API

```js
export default class extends Controller {
  increment() {
    this.count++
    this.renderCount()
  }

  renderCount() {
    this.targets.find("count").textContent = this.count
  }

  get count() {
    return parseInt(this.data.get("count"))
  }

  set count(value) {
    this.data.set("count", value)
  }
}
```

* Try copying the element's HTML again. It works!
* You've made your controller more resilient by saving its state in the DOM

---

Next: [Working With External Resources](05_working_with_external_resources.md)
