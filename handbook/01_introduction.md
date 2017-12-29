#### [<img src="../assets/logo.svg" width="12" height="12" alt="Stimulus">](../README.md) [The Stimulus Handbook](README.md)

---

# 1 Introduction

Stimulus is a new take on an old idea.

Contemporary JavaScript frameworks are built around the notion that HTML is _dirty_. … In the world envisioned by React, and frameworks like it, the DOM is a write-only implementation detail.

By contrast, Stimulus embraces the DOM instead of abstracting it away. … The representational state of a well-crafted Stimulus application lives entirely in the DOM.

Stimulus doesn't concern itself with the details of client-side rendering. Your code works the same way regardless of whether you're performing full page loads, navigating with Turbolinks, fetching partial fragments with Ajax, or using your favorite client-side templating library.

## Connecting HTML to JavaScript

In the background, Stimulus continuously monitors the page, waiting for the magic `data-controller` attribute to appear. Like the `class` attribute, you can put more than one value inside it. But instead of applying or removing CSS class names, `data-controller` values connect and disconnect Stimulus _controllers_.

Think of it like this: in the same way that `class` is a bridge connecting HTML to CSS, `data-controller` is a bridge from HTML to JavaScript.

On top of this foundation, Stimulus adds the magic `data-action` attribute, which describes how events on the page should trigger controller methods, and the magic `data-target` attribute, which gives you a handle for finding elements in the controller's scope.

* Magic attributes let you cleanly separate content from behavior, the same way you already separate content from presentation with CSS
* This separation gives just enough structure to your code to prevent it devolving into "JavaScript soup"
* (Naming = organization = structure ???)
* Attributes also let you read the DOM and see what's going on
* That means when you come back to your templates later, you know where to look for corresponding JavaScript code
* It also means others on your team can easily look at templates—or even the Web Inspector on a production page—to trace behavior or diagnose an issue


---

Next: [Hello Stimulus](02_hello_stimulus.md)
