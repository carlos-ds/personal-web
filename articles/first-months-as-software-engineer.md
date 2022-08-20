---
layout: layouts/article-layout.njk
title: '3 things I learned in my first 2 months as a Software Engineer'
date: 2021-07-27
tags: ['article']
preview: 'A Javascript quirk, RxJS and the value of contracts.'
description: "Learn why null - null === 0 in Javascript, why RxJS is bliss and what the value of contracts is in programming."
---

# {{ title }}

Prelude: in 2017 I was still working as a Digital Marketeer, but found my passion lies in creating and managing software. Nearly four years later, I finally landed my dream job as a (front-end) Software Engineer.

Let me share 3 insights from those first 2 months:

## Javascript: null - null === 0

Why is this statement true? Because values are **implicitly coerced** to numbers when you perform mathematical operations on them. And `null` coerced to a number equals `0`.

This actuallly caused a nice little bug in production. I didn't think through on `a - b` when both can be *null* and figured the result would be *null* as well. 

After fixing it, I called my best friend in these situations: Unit Test. Make sure you keep him close.

## RxJS is relatively easy to grasp

Do you also find **observables** and **subjects** a tad confusing? **Marble diagrams** didn't help me all that much at first. Who still plays with marbles anyway? 

But when you're creating observables on a daily basis, you start to see things differently. It's like Neo in The Matrix. Free yourself from the **restrictions of synchronous programming** and everything starts to make sense.

After a while, you'll immediately spot how to turn synchronous code into asynchronous engineering masterpieces. Don't see it yet? You will when you get there, trust me. 

## Contracts are underrated

Granted, contracts [don't guarantee you'll get it right the first time](https://www.redhat.com/en/blog/achieving-promise-microservices-one-contract-time). Time and effort should be devoted to writing specifications and creating dummy data for endpoints. 

But contracts have real benefits thanks to one fundamental truth: requirements are interpreted differently, based on the interpreter. By defining a contract, there is an **agreement on how (part of) the requirements should be interpreted**. This agreement is not up for debate: it is detailed, accurate and leaves (nearly) no room for interpretation.



