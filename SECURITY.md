# Security Considerations

### Q: Can I be confident that if my cross-site scripting countermeasures fail, there is no way for an attacker to run arbitrary JavaScript using Stimulus?
A: While there is no way for an attacker to run arbitrary JavaScript using Stimulus, if an attacker can insert or modify DOM elements on your page, they can use the `data-action` attribute to [define an action](docs/reference/actions.md) that invokes an arbitrary method on one of your controllers in response to an event.

### Q: If an attacker manages to make changes to my application's DOM, how can I ensure that what they can do is limited if I use Stimulus?
A: Ensure that none of the methods on any of your controllers perform sensitive operations without appropriate safeguards.

Refer to the MDN [Content Security Policy documentation](https://content-security-policy.com) for a general overview of cross-site scripting attacks and how to defend against them.

### Q: Will Stimulus only instantiate and invoke methods on classes marked as controllers?
A: Yes. All controller classes must be registered with corresponding identifiers, either implicitly by way of an autoloader like used in [stimulus-rails](https://github.com/hotwired/stimulus-rails) with import maps or explicitly through a call to `Application#register()`.

### Q: Does Stimulus use `eval()`?
A: No. There is no use of `eval()` in Stimulus. The action system _does_ use dynamic dispatch to invoke controller methods, which corresponds to a runtime property lookup on the controller instance. See the implementation of [`Binding#method`](src/core/binding.ts) for details.
