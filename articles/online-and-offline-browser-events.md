---
layout: layouts/article-layout.njk
title: "Is the user online or offline?"
date: 2020-10-19
tags: ["article", "featured"]
preview: "Working with the Navigator object and online/offline browser events."
description: "Learn how to work with the navigator.onLine property and the online/offline browser events."
containsCodeSnippet: true
---

# {{ title }}

At work, we're developing a PWA (amongst others) and as a new feature, we needed to **warn users when they are offline**. This should incentivise them to first restore their network connection before taking further action, avoiding possible unwanted side effects from being offline.

After testing, I had a look at how it was implemented and was pleasantly surprised.

## Navigator.onLine

The [Navigator object](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events), which you can access in the browser via <code class="inline-code">window.navigator</code>, has an <code class="inline-code">onLine</code> property. This boolean is prone to false positives, but we weren't looking for perfect coverage on this one.

Mind the capital 'L' though!

<pre>
  <code class="language-javascript">
  window.navigator.online
  // undefined

  window.navigator.onLine
  // true
  </code>
</pre>

## Online and offline events

So we know how to check if a user is online or offline. But how can we **detect changes**? Writing custom events has never been anyone's favorite, but luckily the <code class="inline-code">online</code> and <code class="inline-code">offline</code> events are readily available.

Want to try it out? Copy and paste the following code into an HTML file and open it in the browser. Then play with your network connection (in your OS or your browser's DevTools) to see it in action.

<pre>
  <code class="language-html">
    &lt;!DOCTYPE html&gt;
    &lt;html&gt;
      &lt;head&gt;
        &lt;meta charset="UTF-8" /&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
        &lt;title&gt;Online/offline&lt;/title&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;h1 id="status"&gt;&lt;/h1&gt;
      &lt;/body&gt;
      &lt;script&gt;
        function userIsOnline() {
          document.getElementById("status").textContent = "User is online";
        }

        function userIsOffline() {
          document.getElementById("status").textContent = "User is offline";
        }

        if (window.navigator.onLine) {
          userIsOnline();
        } else {
          userIsOffline();
        }

        window.addEventListener("online", userIsOnline);
        window.addEventListener("offline", userIsOffline);
      &lt;/script&gt;
    &lt;/html&gt;
  </code>
</pre>

## NetworkInformation

Although out of scope for our use case, it was interesting to discover <code class="inline-code">window.navigation.connection</code> contained more network goodies, in the form of a [NetworkInformation instance](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation).

In my case, it contained the following:

<pre>
  <code class="language-json">
  downlink: 10,
  effectiveType: "4g",
  rtt: 50,
  saveData: false
  </code>
</pre>

Huh, my downlink seems slow as hell? It's supposed to represent my download speed in Mbps but it's not even close to what I would expect.

Well, it seems like [Chrome arbitrarily caps this value](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink) at 10 as an anti-[fingerprinting](https://cyware.com/news/what-is-cybersecurity-fingerprinting-de718f94) measure.

Well, thank you Google for keeping me safe and secure ;)
