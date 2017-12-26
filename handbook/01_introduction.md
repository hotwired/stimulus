#### [Stimulus](../README.md) | The Stimulus Handbook is a 🚧 work in progress

---

# 1 Introduction

Stimulus is a new take on an old idea.

Contemporary JavaScript frameworks are built around the notion that HTML is _dirty_. … In the world envisioned by React, and frameworks like it, the DOM is a write-only implementation detail.

By contrast, Stimulus embraces the DOM instead of abstracting it away. … The representational state of a well-crafted Stimulus application lives entirely in the DOM.

## Connecting HTML to JavaScript

Stimulus continuously monitors the page for the magic `data-controller` attribute. Like the `class` attribute, you can put more than one value inside it. But instead of applying or removing CSS class names, `data-controller` connects and disconnects Stimulus _controllers_.

Think of it like this: in the same way that `class` is a bridge connecting HTML to CSS, `data-controller` is a bridge from HTML to JavaScript.

On top of this foundation, Stimulus adds the magic `data-action` attribute, which describes how events on the page should trigger controller methods, and the magic `data-target` attribute, which gives you a handle for finding elements in the controller's scope.

## Separation of Code and State

In the early 2000s, the web standards movement championed the separation of presentation, content, and behavior through a philosophy called _progressive enhancement_. …

## The Wiring is Laid Bare

## Render However You Want
