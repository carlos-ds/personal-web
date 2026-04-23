---
layout: layouts/article-layout.njk
title: "Implementing and testing a queue and stack in JavaScript"
date: 2025-11-04
tags: ["article"]
preview: "Two basic data structures, done right with JavaScript."
description: "A queue and a stack: get these basic data structures right in JavaScript"
containsCodeSnippet: true
---

# {{ title }}

## TL;DR

I dabbled into DSA and wanted to play around with the Node test runner. I combined that into some basic coding exercise and dumped it into a [Github repo](https://github.com/carlos-ds/queue-stack). At the end of this article, you'll also find some useful resources for learning DSA in JavaScript.

## Stack

The stack of plates at a cafeteria is the number one analogy for this data structure. You add (**push**) a new plate to the top, you don't shove it in somewhere in between. Neither will you be lifting up plates to get (**pop**) one out .

How I'd go about this in JavaScript:

<pre>
<code class="language-javascript">
class Stack {
  #items;

  constructor(items) {
    if (Array.isArray(items) && items?.length > 0) {
      this.#items = items;
    } else {
      this.#items = [];
    }
  }

  get items() {
    return this.#items;
  }

  push(item) {
    this.#items.push(item);
  }

  pop() {
    this.#items.pop();
  }
}

module.exports = { Stack };
</code>
</pre>

I also wrote some unit tests, just to get more acquainted with the [built-in Node test runner](https://nodejs.org/docs/latest/api/test.html) and [assertion module](https://nodejs.org/docs/latest/api/assert.html). It's fascinating that we no longer have to reach for external libraries to get some decent unit testing done.

<pre>
<code class="language-javascript">
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Stack } = require("./stack");

describe("Stack", () => {
  describe("push", () => {
    it("should add an item to the end of the stack", () => {
      const stack = new Stack(["item 1"]);

      stack.push("item 2");

      assert.strictEqual(stack.items.length, 2);
      assert.strictEqual(stack.items[1], "item 2");
    });
  });

  describe("pop", () => {
    it("should remove the first item from the end of the stack", () => {
      const stack = new Stack(["item 1", "item 2"]);

      stack.pop();

      assert.strictEqual(stack.items.length, 1);
      assert.strictEqual(stack.items[0], "item 1");
    });
  });
});
</code>
</pre>

## Queue

After getting your plate, it's time to enter the queue. Gotta get some of that delicious cafeteria food on there! 

You can't skip the line though! Everyone should enter (**push**) at the back and leave (**shift**) from the front.

<pre>
<code class="language-javascript">
class Queue {
  #items;

  constructor(items) {
    if (Array.isArray(items) && items?.length > 0) {
      this.#items = items;
    } else {
      this.#items = [];
    }
  }

  get items() {
    return this.#items;
  }

  push(item) {
    this.items.push(item);
  }

  shift() {
    this.items.shift();
  }
}

module.exports = { Queue };
</code>
</pre>

Testing it is equally simple thanks to Node's test runner.

<pre>
<code class="language-javascript">
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Queue } = require("./queue");

describe("Queue", () => {
  describe("push", () => {
    it("should add an item to the end of the queue", () => {
      const queue = new Queue(["item 1"]);

      queue.push("item 2");

      assert.strictEqual(queue.items.length, 2);
      assert.strictEqual(queue.items[1], "item 2");
    });
  });

  describe("shift", () => {
    it("should remove the first item from the start of the queue", () => {
      const queue = new Queue(["item 1", "item 2"]);

      queue.shift();

      assert.strictEqual(queue.items.length, 1);
      assert.strictEqual(queue.items[0], "item 2");
    });
  });
});
</code>
</pre>


## My venture into DSA

I've really been into Data Structures and Algorithms (DSA) lately, probably for a variety of reasons:

- With all this talk of AI replacing developers, my time is better spent on fundamentals than on the latest changes in Angular or React.
- Solving hard puzzles is my thing. The UI bling bling is equally great, don't get me wrong. Yet from time to time, give me some algorithms!
- I never boarded the LeetCode hype train and was curious to see what all the fuss is about. 

### Resources for learning Data Structures and Algorithms

Some of the resources I use(d) for learning about DSA:

- [Mosh Hamedani: The Ultimate Data Structures & Algorithms Bundle](https://codewithmosh.com/p/data-structures-algorithms)
  - He's still one of my favorite instructors. If I want to learn something through a video tutorial, Mosh is my man!
- [The Primeagen: The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/)
  - It's hard to explain how good this course is. It's THAT good! And it's one of the few [free courses on Frontend Masters](https://frontendmasters.com/free/), which I find the learning platform with the most bang for your buck!
- [Michael McMillan: Data Structures and Algorithms with JavaScript](https://books.google.be/books/about/Data_Structures_and_Algorithms_with_Java.html)
  - This book is absolutely awesome! I got it from the college library and I was sooo eager to finish it.
