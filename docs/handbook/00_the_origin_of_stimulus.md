---
permalink: /handbook/origin.html
nav_prefix: Preface
order: 00
---

# The Origin of Stimulus

We write a lot of JavaScript at [Basecamp](https://basecamp.com), but we don’t use it to create “JavaScript applications” in the contemporary sense. All our applications have server-side rendered HTML at their core, then add sprinkles of JavaScript to make them sparkle.

This is the way of the [majestic monolith](https://m.signalvnoise.com/the-majestic-monolith-29166d022228). Basecamp runs across half a dozen platforms, including native mobile apps, with a single set of controllers, views, and models created using Ruby on Rails. Having a single, shared interface that can be updated in a single place is key to being able to perform with a small team, despite the many platforms.

It allows us to party with productivity like days of yore. A throwback to when a single programmer could make rapacious progress without getting stuck in layers of indirection or distributed systems. A time before everyone thought the holy grail was to confine their server-side application to producing JSON for a JavaScript-based client application.

That’s not to say that there isn’t value in such an approach for some people, some of the time. Just that as a general approach to many applications, and certainly the likes of Basecamp, it’s a regression in overall simplicity and productivity.

And it’s also not to say that the proliferation of single-page JavaScript applications hasn’t brought real benefits. Chief amongst which has been faster, more fluid interfaces set free from the full-page refresh.

We wanted Basecamp to feel like that too. As though we had followed the herd and rewritten everything with client-side rendering or gone full-native on mobile.

This desire led us to a two-punch solution: [Turbo](https://turbo.hotwired.dev) and Stimulus.

### Turbo up high, Stimulus down low

Before I get to Stimulus, our new modest JavaScript framework, allow me to recap the proposition of Turbo.

Turbo descends from an approach called [pjax](https://github.com/defunkt/jquery-pjax), developed at GitHub. The basic concept remains the same. The reason full-page refreshes often feel slow is not so much because the browser has to process a bunch of HTML sent from a server. Browsers are really good and really fast at that. And in most cases, the fact that an HTML payload tends to be larger than a JSON payload doesn’t matter either (especially with gzipping). No, the reason is that CSS and JavaScript has to be reinitialized and reapplied to the page again. Regardless of whether the files themselves are cached. This can be pretty slow if you have a fair amount of CSS and JavaScript.

To get around this reinitialization, Turbo maintains a persistent process, just like single-page applications do. But largely an invisible one. It intercepts links and loads new pages via Ajax. The server still returns fully-formed HTML documents.

This strategy alone can make most actions in most applications feel really fast (if they’re able to return server responses in 100-200ms, which is eminently possible with caching). For Basecamp, it sped up the page-to-page transition by ~3x. It gives the application that feel of responsiveness and fluidity that was a massive part of the appeal for single-page applications.

But Turbo alone is only half the story. The coarsely grained one. Below the grade of a full page change lies all the fine-grained fidelity within a single page. The behavior that shows and hides elements, copies content to a clipboard, adds a new todo to a list, and all the other interactions we associate with a modern web application.

Prior to Stimulus, Basecamp used a smattering of different styles and patterns to apply these sprinkles. Some code was just a pinch of jQuery, some code was a similarly sized pinch of vanilla JavaScript, and some again was larger object-oriented subsystems. They all usually worked off explicit event handling hanging off a `data-behavior` attribute.

While it was easy to add new code like this, it wasn’t a comprehensive solution, and we had too many in-house styles and patterns coexisting. That made it hard to reuse code, and it made it hard for new developers to learn a consistent approach.

### The three core concepts in Stimulus

Stimulus rolls up the best of those patterns into a modest, small framework revolving around just three main concepts: Controllers, actions, and targets.

It’s designed to read as a progressive enhancement when you look at the HTML it’s addressing. Such that you can look at a single template and know which behavior is acting upon it. Here’s an example:

```html
<div data-controller="clipboard">
  PIN: <input data-clipboard-target="source" type="text" value="1234" readonly>
  <button data-action="clipboard#copy">Copy to Clipboard</button>
</div>
```

You can read that and have a pretty good idea of what’s going on. Even without knowing anything about Stimulus or looking at the controller code itself. It’s almost like pseudocode. That’s very different from reading a slice of HTML that has an external JavaScript file apply event handlers to it. It also maintains the separation of concerns that has been lost in many contemporary JavaScript frameworks.

As you can see, Stimulus doesn’t bother itself with creating the HTML. Rather, it attaches itself to an existing HTML document. The HTML is, in the majority of cases, rendered on the server either on the page load (first hit or via Turbo) or via an Ajax request that changes the DOM.

Stimulus is concerned with manipulating this existing HTML document. Sometimes that means adding a CSS class that hides an element or animates it or highlights it. Sometimes it means rearranging elements in groupings. Sometimes it means manipulating the content of an element, like when we transform UTC times that can be cached into local times that can be displayed.

There are cases where you’d want Stimulus to create new DOM elements, and you’re definitely free to do that. We might even add some sugar to make it easier in the future. But it’s the minority use case. The focus is on manipulating, not creating elements.


### How Stimulus differs from mainstream JavaScript frameworks

This makes Stimulus very different from the majority of contemporary JavaScript frameworks. Almost all are focused on turning JSON into DOM elements via a template language of some sort. Many use these frameworks to birth an empty page, which is then filled exclusively with elements created through this JSON-to-template rendering.

Stimulus also differs on the question of state. Most frameworks have ways of maintaining state within JavaScript objects, and then render HTML based on that state. Stimulus is the exact opposite. State is stored in the HTML, so that controllers can be discarded between page changes, but still reinitialize as they were when the cached HTML appears again.

It really is a remarkably different paradigm. One that I’m sure many veteran JavaScript developers who’ve been used to work with contemporary frameworks will scoff at. And hey, scoff away. If you’re happy with the complexity and effort it takes to maintain an application within the maelstrom of, say, React + Redux, then Turbo + Stimulus will not appeal to you.

If, on the other hand, you have nagging sense that what you’re working on does not warrant the intense complexity and application separation such contemporary techniques imply, then you’re likely to find refuge in our approach.


### Stimulus and related ideas were extracted from the wild

At Basecamp we’ve used this architecture across several different versions of Basecamp and other applications for years. GitHub has used a similar approach to great effect. This is not only a valid alternative to the mainstream understanding of what a “modern” web application looks like, it’s an incredibly compelling one.

In fact, it feels like the same kind of secret sauce we had at Basecamp when we developed [Ruby on Rails](https://rubyonrails.org/). The sense that contemporary mainstream approaches are needlessly convoluted, and that we can do more, faster, with far less.

Furthermore, you don’t even have to choose. Stimulus and Turbo work great in conjunction with other, heavier approaches. If 80% of your application does not warrant the big rig, consider using our two-pack punch for that. Then roll out the heavy machinery for the part of your application that can really benefit from it.

At Basecamp, we have and do use several heavier-duty approaches when the occasion calls for it. Our calendars tend to use client-side rendering. Our text editor is [Trix](https://trix-editor.org/), a fully formed text processor that wouldn’t make sense as a set of Stimulus controllers.

This set of alternative frameworks is about avoiding the heavy lifting as much as possible. To stay within the request-response paradigm for all the many, many interactions that work well with that simple model. Then reaching for the expensive tooling when there’s a call for peak fidelity.

Above all, it’s a toolkit for small teams who want to compete on fidelity and reach with much larger teams using more laborious, mainstream approaches.

Give it a go.

---

David Heinemeier Hansson
