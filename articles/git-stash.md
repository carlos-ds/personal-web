---
layout: layouts/article-layout.njk
title: "Ode to git stash"
date: 2020-11-06
tags: ["article", "featured"]
preview: "Push it away and pop it back in."
description: "Git stash is easy to use. Use 'git stash push' to push your changes away and 'git stash pop' to pop them back in."
containsCodeSnippet: true
---

# {{ title }}

Just had to get this off my chest: I &#10084;&#65039; <code class="inline-code">git stash</code>! A couple of minutes ago, I launched Visual Studio Code, started typing away and saved my changes. Only to realize that I hadn't pulled the latest changes yet.

In this case, we need a place to **stash** our changes, revert the working tree to the latest commit and pull the latest changes. Then we can re-apply the stashed changes and continue as we always would.

The stash command makes this process as clean as a whistle:

<pre>
  <code class="language-git">
  $ git stash push
  Saved working directory and index state WIP on develop: 31ad768 Added alt tag on homepage image of myself
  </code>
</pre>

This saves the unstaged changes that I've made to a new <code class="inline-code">stash entry</code>. And then reverts the branch that we're on (<code class="inline-code">develop</code>) to its latest commit.

We can now safely perform <code class="inline-code">git pull</code>, which updates our working tree with the latest upstream changes. To re-apply the stashed changes, we just have to execute one more command:

<pre>
  <code class="language-git">
  $ git stash pop
  On branch develop
  Your branch is up to date with 'origin/develop'.

  Changes not staged for commit:
    (use "git add &lt;file&gt;..." to update what will be committed)
    (use "git restore &lt;file&gt;..." to discard changes in working directory)
          modified:   articles/git-stash.md
          modified:   index.html

  no changes added to commit (use "git add" and/or "git commit -a")
  Dropped refs/stash@{0} (f34a4648801daed4f0c20535ff7a3cd766df5fe3)
  </code>
</pre>

The changes which I first made in the working tree are once again present and ready to be added!
