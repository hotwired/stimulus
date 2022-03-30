---
permalink: /reference/lifecycle-callbacks.html
order: 01
---

# Lifecycle Callbacks

Special methods called _lifecycle callbacks_ allow you to respond whenever a controller or certain targets connects to and disconnects from the document.

<meta data-controller="callout" data-callout-text-value="connect()">

```js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // …
  }
}
```

## Methods

You may define any of the following methods in your controller:

Method       | Invoked by Stimulus…
------------ | --------------------
initialize() | Once, when the controller is first instantiated
[name]TargetConnected(target: Element) | Anytime a target is connected to the DOM
connect()    | Anytime the controller is connected to the DOM
[name]TargetDisconnected(target: Element) | Anytime a target is disconnected from the DOM
disconnect() | Anytime the controller is disconnected from the DOM

## Connection

A controller is _connected_ to the document when both of the following conditions are true:

* its element is present in the document (i.e., a descendant of `document.documentElement`, the `<html>` element)
* its identifier is present in the element's `data-controller` attribute

When a controller becomes connected, Stimulus calls its `connect()` method.

### Targets

A target is _connected_ to the document when both of the following conditions are true:

* its element is present in the document as a descendant of its corresponding controller's element
* its identifier is present in the element's `data-{identifier}-target` attribute

When a target becomes connected, Stimulus calls its controller's `[name]TargetConnected()` method, passing the target element as a parameter. The `[name]TargetConnected()` lifecycle callbacks will fire *before* the controller's `connect()` callback.

## Disconnection

A connected controller will later become _disconnected_ when either of the preceding conditions becomes false, such as under any of the following scenarios:

* the element is explicitly removed from the document with `Node#removeChild()` or `ChildNode#remove()`
* one of the element's parent elements is removed from the document
* one of the element's parent elements has its contents replaced by `Element#innerHTML=`
* the element's `data-controller` attribute is removed or modified
* the document installs a new `<body>` element, such as during a Turbo page change

When a controller becomes disconnected, Stimulus calls its `disconnect()` method.

### Targets

A connected target will later become _disconnected_ when either of the preceding conditions becomes false, such as under any of the following scenarios:

* the element is explicitly removed from the document with `Node#removeChild()` or `ChildNode#remove()`
* one of the element's parent elements is removed from the document
* one of the element's parent elements has its contents replaced by `Element#innerHTML=`
* the element's `data-{identifier}-target` attribute is removed or modified
* the document installs a new `<body>` element, such as during a Turbo page change

When a target becomes disconnected, Stimulus calls its controller's `[name]TargetDisconnected()` method, passing the target element as a parameter. The `[name]TargetDisconnected()` lifecycle callbacks will fire *before* the controller's `disconnect()` callback.

## Reconnection

A disconnected controller may become connected again at a later time.

When this happens, such as after removing the controller's element from the document and then re-attaching it, Stimulus will reuse the element's previous controller instance, calling its `connect()` method multiple times.

Similarly, a disconnected target may be connected again at a later time. Stimulus will invoke its controller's `[name]TargetConnected()` method multiple times.

## Order and Timing

Stimulus watches the page for changes asynchronously using the [DOM `MutationObserver` API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

This means that Stimulus calls your controller's lifecycle methods asynchronously after changes are made to the document, in the next [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) following each change.

Lifecycle methods still run in the order they occur, so two calls to a controller's `connect()` method will always be separated by one call to `disconnect()`. Similarly, two calls to a controller's `[name]TargetConnected()` for a given target will always be separated by one call to `[name]TargetDisconnected()` for that same target.
