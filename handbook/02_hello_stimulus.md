#### [<img src="../assets/logo.svg" width="12" height="12" alt="Stimulus">](../README.md) [The Stimulus Handbook](README.md)

---

# 2 Hello, Stimulus

## Prerequisites

To follow along, you'll need a running copy of the [stimulus-starter](https://github.com/stimulusjs/stimulus-starter) project. For a simple one-click solution, remix it on Glitch. Or, clone the repository and run it locally.

<a href="https://glitch.com/edit/#!/remix/stimulus-starter"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="remix" height="33"></a>

*or*

```sh
$ git clone https://github.com/stimulusjs/stimulus-starter.git
$ cd stimulus-starter/
$ yarn install
$ yarn start
```

## It All Starts With HTML

* Let's build a simple example: a text field with a button
* When you click the button, we'll display the value of the text field in the console
* We'll start with markup, then annotate it for Stimulus
* Add this to `public/index.html`:

```html
<div>
  <input type="text">
  <button>Greet</button>
</div>
```

## Controllers Bring HTML to Life

* Stimulus automatically connects DOM elements to JavaScript objects
* Those objects are called _controllers_
* Let's create our first controller by extending Stimulus' `Controller` class
* We'll place it in `src/controllers/hello_controller.js`:

```js
// src/controllers/hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
}
```

## Identifiers Link Controllers With the DOM

* Next, we need to tell Stimulus how this controller should be connected to our markup
* We do this by placing an _identifier_ in the `data-controller` attribute:

```html
<div data-controller="hello">
  <input type="text">
  <button>Greet</button>
</div>
```

* In Stimulus, identifiers serve as the link between elements and controllers
* The application continually watches the page for changes
* When it finds an element with `hello` in its `data-controller` attribute, the application creates a new instance of the controller
* Under the hood, Stimulus automatically maps the filename `hello_controller.js` to the identifier `hello`

## Is This Thing On?

* So … how do we know if it's working?
* We can implement the `connect()` method, which Stimulus calls each time the controller is connected to the DOM

```js
// src/controllers/hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    console.log("Hello, Stimulus!", this.element)
  }
}
```

* Load the page in your browser and open the console
* You should see "Hello, Stimulus!", followed by our <div>

## Actions Respond to DOM Events

* Now let's change it so we log message when you click the "Greet" button instead
* Start by renaming `connect()` to `greet()`:

```js
// src/controllers/hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  greet() {
    console.log("Hello, Stimulus!", this.element)
  }
}
```

* We've created an _action_ method called `greet()`
* Action methods are event handlers
* Let's connect the action method to the button's click event
* Open `public/index.html` and add a `data-action` annotation to the button:

```html
<div data-controller="hello">
  <input type="text">
  <button data-action="click->hello#greet">Greet</button>
</div>
```

### Action Descriptors Explained

> * The `data-action` value `click->hello#greet` is called the _action descriptor_
> * Our descriptor says:
>   * `click` is the event name
>   * `hello` is the controller identifier
>   * `greet` is the name of the method to invoke

* Load the page, open the console, and click the button
* You should see the log message in response to your click

## Targets Locate Important Elements By Name

* Now let's change the `greet()` action to say hello to the name in the text field
* In order to do that, first we need a reference to the input element
* We can give the input element a _target_ annotation by adding a `data-target` attribute:

```html
<div data-controller="hello">
  <input data-target="hello.name" type="text">
  <button data-action="click->hello#greet">Greet</button>
</div>
```

### Target Descriptors Explained

> * The `data-target` value `hello.name` is called the _target descriptor_
> * Our descriptor says:
>   * `hello` is the controller identifier
>   * `name` is the target name

* Pass a target name to `this.targets.find()` to find the first matching element
* Read the name from the input element's `value` property
* Log it to the console

```js
// src/controllers/hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  greet() {
    const element = this.targets.find("name")
    const name = element.value
    console.log(`Hello, ${name}!`)
  }
}
```

## Controllers Simplify Refactoring

* One big benefit of controllers is that they're instances of classes
* That means we can break our event handlers down into small methods
* Let's extract two getter methods for clarity
* Pull the element out into its own property:

```js
// src/controllers/hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  greet() {
    const name = this.inputElement.value
    console.log(`Hello, ${name}!`)
  }

  get inputElement() {
    return this.targets.find("name")
  }
}
```

* Next, pull the name value out into its own property:

```js
// src/controllers/hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  greet() {
    console.log(`Hello, ${this.name}!`)
  }

  get name() {
    return this.inputElement.value
  }

  get inputElement() {
    return this.targets.find("name")
  }
}
```

### Wrap-Up and Next Steps

* Congratulations! You've just written your first Stimulus controller
* We've covered the basics; keep reading to learn more

---

Next: [Building Something Real](03_building_something_real.md)
