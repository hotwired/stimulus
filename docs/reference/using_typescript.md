---
permalink: /reference/using-typescript.html
order: 07
---

# Using Typescript

Stimulus itself is written in [TypeScript](https://www.typescriptlang.org/) and provides types directly over its package.
The following documentation shows how to define types for Stimulus properties.

## Define Controller Element Type

By default, the `element` of the controller is of type `Element`. You can override the type of the controller element by specifiying it as a [Generic Type](https://www.typescriptlang.org/docs/handbook/2/generics.html). For example, if the element type is expected to be a `HTMLFormElement`:

<meta data-controller="callout" data-callout-text-value="Controller<HTMLFormElement>">

```ts
import { Controller } from "@hotwired/stimulus"

export default class MyController extends Controller<HTMLFormElement> {
  submit() {
    new FormData(this.element)
  }
}
```

## Define Value Properties

You can define the properties of configured values using the TypeScript `declare` keyword. You just need to define the properties if you are making use of them within the controller.

```ts
import { Controller } from "@hotwired/stimulus"

export default class MyController extends Controller {
  static values = {
    code: String
  }

  declare codeValue: string
  declare readonly hasCodeValue: boolean
}
```

> The `declare` keyword avoids overriding the existing Stimulus property, and just defines the type for TypeScript.

## Define Target Properties

You can define the properties of configured targets using the TypeScript `declare` keyword. You just need to define the properties if you are making use of them within the controller.

 The return types of the `[name]Target` and `[name]Targets` properties can be any inheriting from the `Element` type. Choose the best type which fits your needs. Pick either `Element` or `HTMLElement` if you want to define it as a generic HTML element.

```ts
import { Controller } from "@hotwired/stimulus"

export default class MyController extends Controller {
  static targets = [ "input" ]

  declare readonly hasInputTarget: boolean
  declare readonly inputTarget: HTMLInputElement
  declare readonly inputTargets: HTMLInputElement[]
}
```

> The `declare` keyword avoids overriding the existing Stimulus property, and just defines the type for TypeScript.

## Custom properties and methods

Other custom properties can be defined the TypeScript way on the controller class:

<meta data-controller="callout" data-callout-text-value="container: HTMLElement">

```ts
import { Controller } from "@hotwired/stimulus"

export default class MyController extends Controller {
  container: HTMLElement
}
```

Read more in the [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/intro.html).
