---
layout: layouts/article-layout.njk
title: "Using <script defer>"
date: 2020-12-26
tags: ["article", "featured"]
preview: "The choices you'll make when including scripts."
description: "Learn about async and defer, two attributes of <script> tags which have proven useful ever since they were accepted by most modern browsers."
containsCodeSnippet: true
---

## Introduction: prism.js

To style code blocks on this website, I use [Prism](https://prismjs.com/). It's dead simple, lightweight and looks great everywhere. Plus, you can select just the languages and themes you need, so there's little to no overhead.

<pre>
<code class="language-html">
Hello, this is styled with Prism!
</code>
</pre>

Until recently, the <code class="inline-code">&lt;script&gt;</code> tag for Prism was located just before the closing <code class="inline-code">&lt;/body&gt;</code> tag. Just like everyone always told us to do, right?

However, the **attributes** <code class="inline-code">async</code> **and** <code class="inline-code">defer</code> allow you to reach the same goal, namely to make sure that fetching and/or executing scripts does not block the parsing/rendering of your website.

As a simplified example, let's assume my page contains the following code:

<pre class="language-html">
<code class="language-html">
    &lt;html&gt;
        &lt;head&gt;
            &lt;title&gt;Async & defer&lt;/title&gt;
        &lt;/head&gt;
        &lt;body&gt;
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

So what are our options?

- Include it somewhere in the <code class="inline-code">&lt;head&gt;</code> section
- Include it just before the <code class="inline-code">&lt;/body&gt;</code> tag
- Async
- Defer

Let's go over them one by one.

##

Moved prism.js from body of the page to head with defer With defer, the script is being fetched while the HTML is being parsed. After the HTML has been parsed, and provided it has been fetched by then, it is executed. Only after execution, the DOMContentLoaded event is fired.

MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script Good article by Flavio Copes about the possibilities and differences: https://flaviocopes.com/javascript-async-defer/

## Resources

To be fair, I can't make this topic any clearer than [Flavio Copes](https://flaviocopes.com/javascript-async-defer/) can. (Hint: he's got some pretty good courses and material on other stuff too.)
