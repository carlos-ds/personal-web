---
layout: layouts/article-layout.njk
title: "Partial application"
date: 2023-12-30
tags: ['article']
preview: "About fixing arguments to a function"
description: "What is partial application and how to use it, either with Function.prototype.bind() or with Ramda.js"
containsCodeSnippet: true
---

# {{ title }}

I recently bought a paperback version of Kyle Simpson's [Functional-Light Javascript](https://github.com/getify/Functional-Light-JS) and decided to wrap up one of the main concepts from the first few chapters: partial application.

## What is partial application?

With partial application, we _fix_ certain arguments to a function. One contrived example revolves around a mathematical sum function:

<pre>
<code class="language-javascript">
function sum(a, b) {
  return a + b;
}

const sumThree = sum.bind(null, 3);

sumThree(1);    // 4
sumThree(5);    // 8

const sumFour = sum.bind(null, 4);

sumFour(1);    // 5
sumFour(5);    // 9
</code>
</pre>

But how does this actually work? To answer that question, we need to have a closer look at Javascript functions.

## Function prototype methods

[Every Javascript function is actually a Function object.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Hence, a Javascript function comes with its own set of prototype methods:

- `call()`
- `bind()`
- `apply()`
- `toString()`

In the example above, we called the prototype method `bind` on the function `sum` in order to create the partially applied functions `sumThree` and `sumFour`.

Looking at the signature for `bind`, it is [variadic](https://en.wikipedia.org/wiki/Variadic_function) which means it accepts an indefinite number of arguments. The first parameter is named `thisArg` and represents the value to be passed as the `this` parameter.

Consider:

<pre>
<code class="language-javascript">
const randomObject = {
  a: 1,
};

function sum(x) {
  return this.a + x;
}

const sumThree = sum.bind(randomObject, 3);

sumThree();    // 4
</code>
</pre>

In the (again: contrived) example above, the `this` argument of `sum` was bound to `randomObject` for `sumThree`. While in the first example above, we passed `null` as the first argument because we did not access `this` inside our function body.

## Pop quiz

Pop quiz: can you guess what happens if copy the previous example but instead assign an empty object to `randomObject`?

<pre>
<code class="language-javascript">
const randomObject = {};

// same code as before ...
</code>
</pre>

The answer is:

<pre>
<code class="language-javascript">
sumThree();    // NaN
</code>
</pre>

Why is that? Because `this.a` equals `undefined` when `this` is bound to `randomObject`, the expression to be evaluated is `undefined + 3`.

If you re-read the _type coercion_ rules, for example in [You Don't Know JS Yet: Types & Grammar](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/types-grammar/ch4.md), you will see that in expressions with mathematical operators (such as `+`), both operands are coerced to a number.

That means, the expression to be evaluated after the type coercion is `Number(undefined) + 3`. And `Number(undefined)` equals `NaN`, which leaves `NaN + 3` and that also evaluates to `NaN`.

## Back to partial application

While `bind` is thus undoubtedly the native way for _applying_ (no pun intended) partial application, I will have to agree with the premise in [Functional-Light Javascript](https://github.com/getify/Functional-Light-JS): I don't see a use case for both setting the `this` argument while at the same time partially applying other arguments.

At the time when the specifications for `bind` were created, the goal was likely to consider `this` as just another argument to a function. Thus, having one function to bind _all_ arguments might have made theoretical sense. But practically, it is hard to even come up with a contrived example.

If you tried to make the example above more realistic, you would either pass in the object (or some of its properties) as an argument to the function, or you could make the `x` parameter accessible as a property on `randomObject`. Both options would forgo passing in an actual object as the `this` argument to `bind`, while at the same time passing in one or more arguments to be partially applied.

## Ramda

Let's try to swap `bind` with a method from one of the popular functional programming libraries: [Ramda](https://ramdajs.com/). 

We can re-create the first example as:

<pre>
<code class="language-javascript">
const R = require('ramda');

function sum(a, b) {
  return a + b;
}

const sumThree = R.partial(sum, [3]);

sumThree(1);    // 4
sumThree(5);    // 8
</code>
</pre>

## Fixing multiple arguments

Partial application is not constrained to a single argument. The signature for `bind` accepts an indefinite number of arguments:

<pre>
<code class="language-javascript">
function sum(a, b, c) {
  return a + b + c;
}

const sumThreeAndTwo = sum.bind(null, 3, 2);

sumThreeAndTwo(1);    // 6
sumThreeAndTwo(5);    // 10
</code>
</pre>

Ramda does things a little differently, where the arguments, regardless of their number, should always be passed as an array.

<pre>
<code class="language-javascript">
const R = require('ramda');

function sum(a, b, c) {
  return a + b + c;
}

const sumThreeAndTwo = R.partial(sum, [3, 2]);

sumThreeAndTwo(1);    // 6
sumThreeAndTwo(5);    // 10
</code>
</pre>

I find this syntax from Ramda a lot cleaner than with `sum.bind(null, 3, 2)` as `partial` immediately indicates what we are trying to achieve here. Of course, that comes with the overhead cost of adding a new dependency to your project. Alternatively, you could come up with your own implementation while keeping the same function signature.

## Use cases

We've now seen what partial application is, how you can _apply_ it but the question remains: what is it useful for? I've tried to find specific cases 

- For my IBAN application, I could use it to create a partially applied function for converting strings to the BigInt type using `BigInt(parseInt(...))` where the radix is always 10. In that case, I will have to use `partialRight` though, because otherwise `partial` always fixes the first argument(s), which is not the radix but the string to be parsed. While `partialRight` always fixes the last argument.
- In my daytime job, we frequently use helper functions to convert values to another unit. Put simply, these helper functions have 2 parameters: `value` and `unit`. Instead of always passing an argument for `unit`, we could create separate functions where that unit is fixed, but we can still pass an argument for `value`. This also plays into the argument that functions with a lower _arity_ (the number of parameters a function accepts) can easily be composed from those with a higher arity, while often being easier to read and comprehend.

## Conclusion

While I've obviously barely scratched the surface of partial application, this article feels like a good summary of the basics. We've seen what partial application is, how to use it (either with `bind` or with Ramda), and which use cases there are.