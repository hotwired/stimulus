# Using Typescript

Stimulus itself is written [TypeScript](https://www.typescriptlang.org/)
and provides types directly over its package.
The following documentation shows how to define types for
Stimulus properties.

## Define Controller Element Type

By default, the `element` of the controller is from type `Element`. You can override this in your `extends` statement. For example, if the element type is expected to be a `HTMLFormElement`:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller<HTMLFormElement> {
    submit() {
        new FormData(this.element)
    }
}
```

## Define Controller Value Type

You can define the type of configured values 
using the `declare` feature of TypeScript:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller {
    static values = {
        code: String,
    };

    declare readonly codeValue: string;
}
```

> The `declare` avoids overriding the exist Stimulus property, and just defines the type for TypeScript.

## Define Controller Target Type

You can define the type of configured targets 
using the `declare` feature of TypeScript:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller {
    static targets = [
        'input'
    ];

    declare readonly inputTarget: HTMLInputElement;
}
```

> The `declare` avoids overriding the exist Stimulus property, and just defines the type for TypeScript.

## Custom properties amd methods

Other custom properties can be defined the TypeScript way
on the controller class:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller {
    container: HTMLElement;
}
```

Read more in the [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/intro.html).
