---
permalink: /handbook/designing-for-resilience.html
order: 04
---

# Designing For Resilience

Although the clipboard API is [well-supported in current browsers](https://caniuse.com/#feat=clipboard), we might still expect to have a small number of people with older browsers using our application.

We should also expect people to have problems accessing our application from time to time. For example, intermittent network connectivity or CDN availability could prevent some or all of our JavaScript from loading.

It's tempting to write off support for older browsers as not worth the effort, or to dismiss network issues as temporary glitches that resolve themselves after a refresh. But often it's trivially easy to build features in a way that's gracefully resilient to these types of problems.

This resilient approach, commonly known as _progressive enhancement_, is the practice of delivering web interfaces such that the basic functionality is implemented in HTML and CSS, and tiered upgrades to that base experience are layered on top with CSS and JavaScript, progressively, when their underlying technologies are supported by the browser.

## Progressively Enhancing the PIN Field

Let's look at how we can progressively enhance our PIN field so that the Copy button is invisible unless it's supported by the browser. That way we can avoid showing someone a button that doesn't work.

We'll start by hiding the Copy button in CSS. Then we'll _feature-test_ support for the Clipboard API in our Stimulus controller. If the API is supported, we'll add a class name to the controller element to reveal the button.

We start off by adding `data-clipboard-supported-class="clipboard--supported"` to the `div` element that has the `data-controller` attribute:

```html
  <div data-controller="clipboard" data-clipboard-supported-class="clipboard--supported">
```

Then add `class="clipboard-button"` to the button element:

```html
  <button data-action="clipboard#copy" class="clipboard-button">Copy to Clipboard</button>
```

Then add the following styles to `public/main.css`:

```css
.clipboard-button {
  display: none;
}

.clipboard--supported .clipboard-button {
  display: initial;
}
```

First we'll add the `data-clipboard-supported-class` attribute inside the controller as a static class:

```js
  static classes = [ "supported" ]
```

This will let us control the specific CSS class in the HTML, so our controller becomes even more easily adaptable to different CSS approaches. The specific class added like this can be accessed via `this.supportedClass`.

Now add a `connect()` method to the controller which will test to see if the clipboard API is supported and add a class name to the controller's element:

```js
  connect() {
    if ("clipboard" in navigator) {
      this.element.classList.add(this.supportedClass);
    }
  }
```

You can place this method anywhere in the controller's class body.

If you wish, disable JavaScript in your browser, reload the page, and notice the Copy button is no longer visible.

We have progressively enhanced the PIN field: its Copy button's baseline state is hidden, becoming visible only when our JavaScript detects support for the clipboard API.

## Wrap-Up and Next Steps

In this chapter we gently modified our clipboard controller to be resilient against older browsers and degraded network conditions.

Next, we'll learn about how Stimulus controllers manage state.
