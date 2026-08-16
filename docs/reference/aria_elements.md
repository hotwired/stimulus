---
permalink: /reference/aria_elements.html
order: 05
---

# ARIA Elements

_ARIA Elements_ provide direct access to _elements_ within (and without!) a Controller's scope based on their `[id]` attribute's value.

They are conceptually similar to [Stimulus Targets](https://stimulus.hotwired.dev/reference/targets) and [Stimulus Outlets](https://stimulus.hotwired.dev/reference/outlets), but provide access regardless of where they occur in the document.

<meta data-controller="callout" data-callout-text-value='aria-controls="accordion"'>
<meta data-controller="callout" data-callout-text-value='id="accordion"'>


```html
<button aria-controls="accordion" aria-expanded="false"
        data-controller="disclosure" data-action="click->disclosure#toggle">
  Show #accordion
</button>

...

<div id="accordion" hidden>
  ...
</div>
```

While a **target** is a specifically marked element **within the scope** of its own controller element, an **ARIA element** can be located **anywhere on the page**.


## Definitions

Unlike Targets, support for ARIA Elements is built into all Controllers, and
doesn't require definition or additional configurations.

Out-of-the-box, Controllers provide Elements support for all [ARIA ID reference
and ID reference list attributes][aria-ref] that establish [`[id]`-based
relationships][id-relationship], including:

* [aria-activedescendant](https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant)
* [aria-controls](https://www.w3.org/TR/wai-aria-1.2/#aria-controls)
* [aria-describedby](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
* [aria-details](https://www.w3.org/TR/wai-aria-1.2/#aria-details)
* [aria-errormessage](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
* [aria-flowto](https://www.w3.org/TR/wai-aria-1.2/#aria-flowto)
* [aria-labelledby](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby)
* [aria-owns](https://www.w3.org/TR/wai-aria-1.2/#aria-owns)

[aria-ref]: https://www.w3.org/TR/wai-aria-1.2/#propcharacteristic_value
[id-relationship]: https://www.w3.org/TR/wai-aria-1.2/#attrs_relationships

## Properties

For each ARIA ID reference and ID reference list attribute, Stimulus adds three properties to your controller, where `[name]` corresponds to an attribute's name:

| Kind          | Property name         | Return Type       | Effect
| ------------- | --------------------- | ----------------- | -----------
| Existential   | `has[Name]Element`    | `Boolean`         | Tests for presence of an element with `[id="${name}"]`
| Singular      | `[name]Element`       | `Element`         | Returns the first `Element` whose `[id]` value is included in the `[name]` attribute's token or throws an exception if none are present
| Plural        | `[name]Elements`      | `Array<Element>`  | Returns all `Element`s whose `[id]` values are included in the `[name]` attribute's tokens

Kebab-case attribute names are transformed to camelCase and TitleCase according
to the following rules:

| Attribute name        | camelCase name       | TitleCase name
| --------------------- | -------------------- | ----------
| aria-activedescendant | ariaActiveDescendant | AriaActiveDescendant
| aria-controls         | ariaControls         | AriaControls
| aria-describedby      | ariaDescribedBy      | AriaDescribedBy
| aria-details          | ariaDetails          | AriaDetails
| aria-errormessage     | ariaErrorMessage     | AriaErrorMessage
| aria-flowto           | ariaFlowTo           | AriaFlowTo
| aria-labelledby       | ariaLabelledBy       | AriaLabelledBy
| aria-owns             | ariaOwns             | AriaOwns

The casing rules for these names are outlined under [§ 10.1 Interface Mixin ARIAMixin](https://w3c.github.io/aria/#x10-1-interface-mixin-ariamixin) of the [Accessible Rich Internet Applications (WAI-ARIA) 1.3 Specification](https://w3c.github.io/aria/).

## ARIA Element Callbacks

ARIA Element callbacks are specially named functions called by Stimulus to let you respond to whenever a referenced element is added or removed from the document.

To observe reference changes, define a method named `[name]ElementConnected()` or `[name]ElementDisconnected()`.

<meta data-controller="callout" data-callout-text-value="ariaActiveDescendantElementConnected(element)">
<meta data-controller="callout" data-callout-text-value="ariaActiveDescendantElementDisconnected(element)">

```js
// combobox_controller.js

export default class extends Controller {
  static target = [ "selected" ]

  ariaActiveDescendantElementConnected(element) {
    this.selectedTarget.innerHTML = element.textContent
  }

  ariaActiveDescendantElementDisconnected(element) {
    this.selectedTarget.innerHTML = "No selection"
  }
}
```

### ARIA Elements are Assumed to be Present

When you access an ARIA Element property in a Controller, you assert that at least one corresponding ARIA Element is present. If the declaration is missing and no matching element is found Stimulus will throw an exception:

```html
Missing element referenced by "[aria-controls]" for "disclosure" controller
```

### Optional ARIA Elements

If an ARIA Element is optional or you want to assert that at least one ARIA Element is present, you must first check the presence of the ARIA Element using the existential property:

```js
if (this.hasAriaControlsElement) {
  this.safelyCallSomethingOnTheElement(this.ariaControlsElement)
}
```

Alternatively, looping over an empty Array of references would have the same
result:

```js
for (const ariaControlsElement of this.ariaControlsElements) {
  this.safelyCallSomethingOnTheElement(this.ariaControlsElement)
}
```
