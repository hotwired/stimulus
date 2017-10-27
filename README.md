# Sentinella

Sentinella is a JavaScript library of practical wrappers around the DOM `MutationObserver` API. It watches the document and can **notify you of changes scoped by:**

* **Attribute**. Use [AttributeObserver](#attributeobserver) to track when elements with a given attribute appear or disappear from the document, and when the values of those attributes change.
* **Token list**. A token list is an attribute whose value is a space-separated set of tokens (like the HTML `class` attribute). Use [TokenListObserver](#tokenlistobserver) to be notified as tokens come and go.
* **CSS selector**. Use [SelectorObserver](#selectorobserver) to track when elements match or stop matching a set of CSS simple selectors.

If the built-in observers don't suit your needs, you can roll your own using the low-level [ElementObserver](#elementobserver), which helps you efficiently match and track arbitrary DOM changes.

## Installation

Include the [`sentinella` npm package](https://www.npmjs.com/package/sentinella) in your application using your preferred asset bundling tool.

Or, load the `sentinella.js` browser bundle in a `<script>` tag directly and access the API through the `window.Sentinella` global.

## Usage

Sentinella consists of a set of _observer_ classes which track the state of the document according to particular criteria with a DOM [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

#### Trees Scope the Set of Observed Elements

The first argument to a Sentinella observer's constructor is the _tree_—the DOM element which scopes the set of observed elements.

Observers track changes to the tree element along with changes to any of its child elements.

#### Delegate Objects Respond to Observed Changes

Each Sentinella observer class has its own _delegate interface_, which is the set of callback methods that notify you of relevant changes to the document.

To use an observer, you must provide an object which impelements its delegate interface. This object is known as a _delegate_ and is always the last argument of the observer's constructor.

_Mention TypeScript types_

#### Delegate Method Invocations are Deferred

The browser batches `MutationObserver` records and delivers them in a [microtask](https://www.w3.org/TR/html51/webappapis.html#microtask-queue) following the mutation itself.

That means Sentinella observers do not invoke their delegates' methods synchronously as changes happen, but rather at the end of the current run of the JavaScript event loop.

Delegates may be anonymous objects, or they may be instances of classes ...

_Define match and unmatch_

_Mention starting and stopping_

### `AttributeObserver`

The `AttributeObserver` class observes all elements in a tree with a particular attribute.

```js
import { AttributeObserver } from "sentinella"

const tree = document.documentElement
const attributeName = "data-example"
const delegate = {
  elementMatchedAttribute(element, attributeName) {
    // Called each time a `data-example` attribute appears on an element
  }
  elementAttributeValueChanged(element, attributeName) {
    // Called each time the value of a `data-example` attribute changes
  }
  elementUnmatchedAttribute(element, attributeName) {
    // Called each time a `data-example` attribute disappears
  }
}

const observer = new AttributeObserver(tree, attributeName, delegate)
observer.start()
```

Since each delegate method receives the matching element and attribute name, it is possible to connect multiple `AttributeObserver` instances to a single delegate object.

### `TokenListObserver`

### `SelectorObserver`

### `ElementObserver`
