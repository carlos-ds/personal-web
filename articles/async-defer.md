---
layout: layouts/article-layout.njk
title: 'Loading scripts with async / defer'
date: 2020-12-26
tags: ['article', 'featured']
preview: 'The choices we make when including scripts.'
description: 'Learn about async and defer, two attributes of <script> tags which have proven useful ever since they were accepted by most modern browsers.'
containsCodeSnippet: true
---

# {{ title }}

## Introduction: prism

To style code blocks on this website, I use [Prism](https://prismjs.com/). It's dead simple, lightweight and looks great everywhere. Plus, you can select just the languages and themes you need, so there's little to no overhead.

<pre>
<code class="language-html">
&lt;p class="example"&gt;This is styled with Prism!&lt;/p&gt;
</code>
</pre>

Until recently, I included the `<script>` tag for Prism **just before the closing** `</body>` **tag**. Just like everyone always told us to do, right? Execution is synchronous, and you don't want your scripts blocking the rest of your page.

## Async & defer

However, the **attributes** `async` **and** `defer` allow you to reach the same goal, namely to make sure that fetching and/or executing scripts does not block parsing.

As a simplified example, let's assume my page contains the following code:

<pre class="language-html">
<code class="language-html">
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Async & defer&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;p&gt;Lorem ipsum dolor sit amet&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code>
</pre>

Somewhere in this code, we need to include the script for Prism:

<pre>
<code class="language-html">
&lt;script src="/assets/js/prism.js"&gt;&lt;/script&gt;
</code>
</pre>

What are our options?

- Include it in the `<head>` section. But we know that's just a bad practice.
- Include it just before the `</body>` tag.
- Include it with `async` in the `<head>` section.
- Include it with `defer` in the `<head>` section.

To be fair, I can't make the differences any clearer than [Flavio Copes](https://flaviocopes.com/javascript-async-defer/) can. This means we can skip the detailed comparison here and go straight to how I approached this: with `defer`.

## Defer

Deferred scripts are fetched asynchronously and executed immediately after parsing of the DOM.

Our simplified example now looks like this:

<pre class="language-html">
<code class="language-html">
&lt;html&gt;
    &lt;head&gt;
        &lt;script defer src="/assets/js/prism.js"&gt;&lt;/script&gt;
        &lt;title&gt;Async & defer&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;p&gt;Lorem ipsum dolor sit amet&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code>
</pre>

The flow here is:

- Parsing starts
- Parser encounters deferred script ➡️ fetching starts
- Parsing continues in parallel with fetching
- Fetching completes
- Parsing completes
- Script is executed
- [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event) event is fired

## Async

With `async`, the flow would be a little different:

- Parsing starts
- Parser encounters asynchronous script ➡️ fetching starts
- Parsing continues in parallel with fetching
- Fetching completes
- Script is executed
- Parsing completes
- DOMContentLoaded event is fired

This means that **execution occurs immediately after fetching has completed**. As opposed to `defer`, which executes only after the parsing has fully completed. Because we rely on the whole DOM being present before Prism does its magic, I preferred to defer the Prism script.

Another difference is that deferred scripts are executed in the order in which they were encountered. That's not the case for asynchronous scripts, making them a **prime candidate for standalone scripts** (e.g. ads, analytics ...).

## Is the juice worth the squeeze?

Well, `async` and `defer` are **not fully compatible** with IE9 and older. However, I sincerely hope that's not relevant for you.

They also **don't guarantee faster loading times**. In my case, the time it takes before DOMContentLoaded is fired differs just a couple of miliseconds when the script is deferred.

The best piece of advice: **perform tests** if you plan to switch things up. The number of factors is just too high to provide a one-size-fits-all approach:

- What if parsing ends before the fetching of your script?
- What if you combine multiple approaches?
- How much of your bandwidth is dedicated to fetching compared to other tasks that require bandwidth?

Then why go through all the trouble?

For me, using asynchronous or deferred scripts is about **cleaning up your code**. Because our scripts are meant to be somewhere in the `<head>`. Placing them anywhere else was just a **cheeky workaround** in the endeavour for maximum performance.
