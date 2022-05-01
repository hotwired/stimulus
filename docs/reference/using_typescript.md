# Using Typescript

Stimulus itself is written [TypeScript](https://www.typescriptlang.org/)
and provides types directly over its package.
The following documentation should make it clear how to define types for
stimulus properties.

## Define Controller Element Type

By default, the `element` of the controller is from type `Element`.  
If the element expected type is as example `HTMLFormElement` it can
be defined this way:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller<HTMLFormElement> {
    submit() {
        new FormData(this.element)
    }
}
```

## Define Controller Value Type

To define the type of configured values is possible
over the declare feature of TypeScript:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller {
    static values = {
        code: String,
    };

    declare readonly codeValue: string;
}
```

> The `declare` avoids override of the exist stimulus property and just define the type for TypeScript.

## Define Controller Target Type

To define the type of configured targets is possible
over the declare feature of TypeScript:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller {
    static targets = [
        'input'
    ];

    declare readonly inputTarget: HTMLInputElement;
}
```

> The `declare` avoids override of the exist stimulus property and just define the type for TypeScript.

## Custom properties amd methods

Other custom properties is possible to define the TypeScript way
on the controller class:

```ts
import { Controller } from '@hotwired/stimulus';

export default class MyController extends Controller {
    container: HTMLElement;
}
```

Read more about it in the [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/intro.html).
