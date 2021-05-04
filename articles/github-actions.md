---
layout: layouts/article-layout.njk
title: 'Integrating Jest with Github Actions'
date: 2021-04-23
tags: ['article']
preview: 'Run tests, merge into master and push.'
description: "Set up a basic workflow with Github Actions. We'll cover how to automate running tests (Jest) on a development branch, merging into master and pushing."
---

# {{ title }}

In this article, we'll set up a basic workflow with [Github Actions](https://github.com/features/actions). This tool allows you to automate countless actions, triggered by Github events.

## Who is it for?

Currently, Github Actions is **free** for all **public repositories**. And **private repositories** have up to **2.000 free minutes per month**. Additional minutes are available at a per-minute basis.

The flow described below is fairly simple and takes more or less 1 minute to finish. Hence, if our example repository was private (which it is not), it would allow me to automatically pull, test and merge around **2000 times per month**. That equates to **66 pushes per day**, not something you're likely to encounter for a personal side project.

## What will we automate?

- Pulling the development branch of our Angular project
- Installing dependencies
- Running all unit test suites
- If successful, merging the development branch into master

## When will we execute this?

Upon every push to the development branch.

## How to get started?

The process is relatively easy. In [our project](https://github.com/carlos-ds/iban), we create a new folder <code class="inline-code">.github/workflows</code>. Inside of this new folder, create a new YAML file (e.g. test.yml).

The full content for my project looks like this:

- _Name_: a name for our workflow.  
  This name will show up in Github Actions' reports.
- _On_: the trigger to run our workflow.
- _Jobs_: all jobs that need to be executed.  
  Every job consists of one or multiple steps.

The full contents of the file look like this:

<pre style="padding: 0 1rem; color: #ccc; background: #2d2d2d; border: 1px solid black; font-size: 1.2rem;">
<code>
name: Run unit tests, merge develop into master and push

on:
  push:
    branches: [develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      # Pull repository into the current pipeline
      - name: Pull repository
        uses: actions/checkout@v2

      - name: NPM install
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Merge develop into master and push
        run: |
          git fetch --unshallow
          git checkout master
          git pull
          git merge develop -m "Auto merge dev into master"
          git push
</code>
</pre>

## Breakdown

Let's break that file down, shall we?

<pre style="padding: 0 1rem; color: #ccc; background: #2d2d2d; border: 1px solid black; font-size: 1.2rem;">
<code>
name: Run unit tests, merge develop into master and push
</code>
</pre>

Name for our workflow. This will show up in Github Actions' reports.

<pre style="margin-top: 3rem; padding: 0 1rem; color: #ccc; background: #2d2d2d; border: 1px solid black; font-size: 1.2rem;">
<code>
on:
  push:
    branches: [develop]
</code>
</pre>

The workflow is triggered upon every push to the branch named <code class="inline-code">develop</code>.

<pre style="margin-top: 3rem; padding: 0 1rem; color: #ccc; background: #2d2d2d; border: 1px solid black; font-size: 1.2rem;">
<code>
jobs:
  build-and-test:
    runs-on: ubuntu-latest
</code>
</pre>

A workflow consists of one or multiple jobs. Each job has a name and consists of one or multiple steps. With <code class="inline-code">runs-on</code>, we can specify the type of machine for each job. Our job will run on the latest version of Ubuntu (20.04).

<pre style="margin-top: 3rem; padding: 0 1rem; color: #ccc; background: #2d2d2d; border: 1px solid black; font-size: 1.2rem;">
<code>
    steps:
      # Pull repository into the current pipeline
      - name: Pull repository
        uses: actions/checkout@v2

      - name: NPM install
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Merge develop into master and push
        run: |
          git fetch --unshallow
          git checkout master
          git pull
          git merge develop -m "Auto merge dev into master"
          git push
</code>
</pre>

The [checkout (v2) action](https://github.com/actions/checkout) is likely among the most wielded custom actions. Since we are triggering this workflow by pushing to a certain branch (develop), this action will automatically checkout that branch. We don't have to explicitly mention it in the options.

Next, we're doing a clean install of our dependencies with <code class="inline-code">npm ci</code>. This approach is preferred over <code class="inline-code">npm install</code>, because it ensures all our dependencies have the same version as the ones specified in the <code class="inline-code">package-lock.json</code> file of our development branch.

Then, our **test suites** are run with Jest by calling <code class="inline-code">npm test</code>.

There are two options:

- All tests pass and the workflow proceeds to the next step.
- A test fails and the workflow exits with a corresponding error code. You receive an e-mail notifying you of this failure. It also shows up in the "Actions" tab of your repository.

Assuming all tests pass, the workflow will continue with the final step. It checks out the master branch, merges the development branch into it and push the changes.

Notice how the **pipe symbol** allows specifying multiple commands in one step. For Ubuntu, these commands are run in sequence with git bash.

## Reports

In the Actions tab of your re

## Master has been pushed. What's next?

Well, if you're running an application on a platform like Heroku or Netlify, you can trigger automated deploys by pushing to the master branch. Assuming you have activated that option in your application settings, obviously.

For me, automating these processes (run tests, merge and deploy) **made my life significantly easier**. I just need to push changes to the development branch and if everything goes well, my changes are visible after a couple of minutes.

## Conclusion

Interested in more examples of Github Actions? Have a look at the [quickstart guide for Github Actions](https://docs.github.com/en/actions/quickstart) or the [Github Actions cheat sheet](https://resources.github.com/whitepapers/GitHub-Actions-Cheat-sheet/).
