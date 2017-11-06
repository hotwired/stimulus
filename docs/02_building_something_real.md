# Building Something Real

* Logging hello to the console isn't very exciting
* Let's build something we might actually use
* We'll go over a real example from Basecamp

```html
<div data-controller="copy-to-clipboard">
  <input data-target="copy-to-clipboard.source" type="text" value="https://basecamp.com/">
  <button data-action="copy-to-clipboard#copy">Copy</button>
</div>
```

```js
export default class CopyToClipboardController extends ApplicationController {
  copy() {
    this.sourceElement.select()
    document.execCommand("copy")
  }

  get sourceElement() {
    return this.targets.find("source")
  }
}
```
