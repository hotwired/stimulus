---
slug: /security
---

# Security

In the last chapter we saw how to acquire and release external resources using Stimulus lifecycle callbacks.

Unfortunately, modern systems are under attack, so we need to make sure that our software resists attack (and limits damage if the attacker succeeds).  In this chapter we'll examine how to develop secure applications with Stimulus.

## Security basics

First, make sure that your software resists attack in general.  That's especially important if your software takes data from untrusted sources (that is, data sources you don't totally trust).  For example:

* Rigorously validate untrusted input against a whitelist (a maximally restrictive pattern).
* When generating output, be sure to escape it correctly.  Many web frameworks (such as Rails) automatically escape untrusted output, which is safer.  If you do not escape data correctly, your software may be vulnerable to a cross-site scripting (XSS) attack.
* Use many tools to try to detect vulnerabilities.  Both static analysis tools (which examine the code without running it) and dynamic analysis tools (which run the code) can help.
* Use HTTPS (TLS) to protect the communications channel.
* Harden your software against attack, for example, use HTTP hardening headers.

You may find useful materials from [Open Web Application Security Project (OWASP)](https://www.owasp.org/index.php/Main_Page), including its [OWASP Top Ten](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project).

## Use a Maximally Restrictive Content Security Policy (CSP)

CSP is an important added layer of security in modern browsers. CSP helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and other kinds of data injection attacks.

In any web application you should set your CSP to be restrictive as possible, regardless of whether or not it uses Stimulus.  In particular, all your JavaScript code should be in *separate* files, and the CSP should be set so that scripts are only accepted from valid sources (never from the HTML file). That way, if a value is not escaped properly (a common problem), an attacker still can't easily turn it into an XSS attack (because scripts are not run directly if they are in the HTML).

CSP includes various work-arounds if you must embed scripts in the HTML, but it is better to avoid the work-arounds.  The work-arounds often make the code more complicated to maintain, and aren't as well supported.

For more information, see the [OWASP CSP Cheat Sheet](https://www.owasp.org/index.php/Content_Security_Policy_Cheat_Sheet).

## Stimulus does not just execute what's in the HTML

CSP is valuable when using Stimulus, just like CSP is useful in other frameworks, because Stimulus does not just execute ("eval") code in the HTML.  Indeed, Stimulus does not use `eval` at all.

The Stimulus action system _does_ use dynamic dispatch to invoke controller methods, but that's simply a property lookup on the controller instance. See the [EventListener class](https://github.com/stimulusjs/stimulus/blob/9bb10c60b09cfd471286710acbb736e1a21bc449/packages/%40stimulus/core/src/event_listener.ts#L37-L51) for details.

## Hardening against XSS

Unfortunately, in many systems it's easy to incorrectly escape a value.  Attackers try to turn these mistakes into XSS attacks.  While there is no way for an attacker to run arbitrary JavaScript using Stimulus, if attackers can insert or modify DOM elements on your page, they can use the `data-action` attribute to register an action that invokes an arbitrary method on one of your controllers in response to an event.

First, it's important to understand that Stimulus will *only* call classes you have defined and marked as controllers.  All controller classes must be registered with corresponding identifiers in your Stimulus `Application`.

Thus, if you're trying to counter an attacker who might be able to inject something into your HTML, just ensure that none of the methods on any of your controllers perform sensitive operations without appropriate safeguards.  In these cases all controller methods should treat their inputs with suspicion, and limit the effects they can cause.

## Wrap-Up and Next Steps

In this chapter we've seen how to maintain security.

Next we'll see how to install and configure Stimulus in your own application.
