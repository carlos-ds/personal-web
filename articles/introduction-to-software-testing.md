---
layout: layouts/article-layout.njk
title: "Course review: Introduction to software testing (Coursera)"
date: 2020-11-27
tags: ["article", "featured"]
preview: "The good, the bad and the ugly."
description: "My personal opinion on the Coursera course 'Introduction to software testing'."
containsCodeSnippet: true
---

# {{ title }}

A couple of months ago, I took a course on Coursera named _["Introduction to software testing"](https://www.coursera.org/learn/introduction-software-testing)_, which is a part of the _["Software testing and automation"](https://www.coursera.org/specializations/software-testing-automation)_ specialization. And I'd like to add my 2 cents.

Before we dive in, I'll summarize it for you:

**The good**:

- Theoretical concepts are properly explained.
- Provides a solid foundation for future learning about software testing.
- Knowledgeable instructors from a respected university.

**The bad**:

- Interaction with students and teachers is next to nothing.
- Course content feels outdated or out of place at times.

## The theory behind testing

Although I'm not the biggest fan, you can't blame this course for not doing what it says on the tin: provide an _introduction to software testing_. It touches on a fair amount of theoretical concepts which testers should understand. And even developers will find there's a lot in it for them.

Module 1 starts off by answering the questions _"What is a test?"_, _"Why should we test?"_ and _"How can we test well?"_. The course then discusses the differences between validation and verification, and progresses towards [the V-Model](<https://en.wikipedia.org/wiki/V-Model_(software*development)>).

Although a strict application of the V-Model is perhaps rather unusual, being conscious of it is still beneficial towards a better understanding of software testing.

In the second module, topics such as **dependability**, **structural testing**, **mutation testing** and **error-prone aspects** (null pointers, boundaries ...) are also brought up.

Up to here, I was very enthusiastic. There's a lot of valuable information in these two modules. Even more for testers who don't have a background in software engineering, such as myself.

## Test plan(ning)

However, the third module is where I started to feel lost. Some advice from the videos is definitely actionable (e.g. "also document what can not be tested"), but the content here feels outdated and too comprehensive. More specifically, the part about **defect reporting** seems like something I could've made in half an hour of browsing through JIRA tickets.

To make matters worse, the exercise we were given was an absolute fluke. You are asked to **draft a test plan** by applying what you've learnt in this module, then submit it for review by your fellow students. The requirements make it feel like this is an application running on Windows 3.11. Hello, 2020?!

After submission, you're also asked to review 3 test plans from other students, using a questionnaire (e.g. "does the test plan include information about X?"). Unfortunately, based on the examples I've seen, a lot of students don't take the exercise (both writing and reviewing) serious and just want to make it through. I also seriously doubt whether the questionnaire truly evaluated the quality of a submission.

## Writing unit tests

The fourth and final module covers writing **unit tests** ([JUnit](https://junit.org/), [Mockito](https://site.mockito.org/)) and **code coverage** ([JaCoCo](https://www.eclemma.org/jacoco/)). You're given some practical assignments, graded via automated scripts, which are reasonably qualitative.

I definitely learned a thing or two here, but it didn't feel like the right time and place. The assignments' code quality is also up for debate (based on some comments on Coursera), but my knowledge of Java is too limited to address that.

## Conclusion

I would very much recommend the first and second module of this course. They touched on a lot of interesting topics and were delivered at the right pace for me.

But the third and fourth module just didn't feel right. That holds me back from taking the next course in the specialization, which currently also has a lower review score. When you add the lack of interaction with other students and teachers, it's not encouraging me to continue. But it was well worth the effort!
