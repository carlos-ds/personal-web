---
layout: layouts/article-layout.njk
title: "How to develop a Chrome extension"
date: 2020-09-09
tags: ["article", "featured"]
preview: "I wanted to fix a particularly common problem."
description: "Step-by-step guide to developing a simple but effective Google Chrome extension that fixes a common problem."
containsCodeSnippet: true
---

# {{ title }}

## TL;DR

I've developed a fairly simple Chrome extension called "Mistake" and have shared the source code on [Github](https://github.com/carlos-ds/mistake). To install the extension and try it yourself, follow the instructions on Github. I've made a small video to show how it works, you can also read more about that in this article.

<video width="100%" controls>
  <source src="/assets/vid/mistake-chrome-extension-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## The problem

At work, I'm often confronted with the fact that it's outright dangerous to open **multiple browser tabs** containing the **same application**, but in different environments. For obvious reasons, you don't want to perform test actions on your production environment.

There are soms ways to avoid this, with one of the most common ones is to use **environment variables** for **styling** certain elements. For example, the production environment has a <span style="color: green;">green</span> background color for the navigation bar or document body, whilst the test environments have a <span style="color: red;">red</span> background color.

Unfortunately, the current application I'm working with doesn't have that feature. And after I almost performed an unwanted action on the production environment, thinking it was QA, I went looking for solutions.

_Disclaimer: I contemplated working with Angular or React, but decided it just wasn't worth it. It definitely could have made my life easier, but I'm just not comfortable enough with it (yet) and I decided to go plain Javascript. This was something I actually needed, so I wanted to have a functional version ASAP._

## Out of the box: Stylish

The first thing I found was [Stylish](https://chrome.google.com/webstore/detail/stylish-custom-themes-for/fjnbnpbmkenffdnngjfgmeleoegfcffe/related?hl=en). It lets you choose customized styles/themes for popular websites. But you can also write some of your own styles and apply it to URLs that match certain patterns.
Which sparked the idea to build something similar, which would allow me to display a custom message at the top of certain webpages. These messages could then serve as an indication of the environment in which I'm currently working.

## Getting started on a custom solution

The first thing we need to do is create _manifest.json_. Here, we declare general application information and some configuration basics.

<pre>
  <code class="language-json">
  {
    "name": "Mistake",
    "version": "1.0",
    "description": "Avoid disaster in production by displaying a message on pages that meet the criteria you define.",
    "permissions": ["webNavigation", "storage", "activeTab"],
    "content_scripts": [
      {
        "matches": ["&lt;all_urls&gt;"],
        "js": ["content.js"],
        "run_at": "document_idle"
      }
    ],
    "manifest_version": 2,
    "options_page": "options.html"
  }
  </code>
</pre>

The most important thing here is **declaring the right permissions**. For example, we need to tell Google Chrome that we need access to the _storage API_. Because in order to save the message and its details, we need a place to store that information.

Access to the _webNavigation API_ is required, because every time a user navigates in Chrome, we want to check if the page matches one of the rules he has described on the options page.

## Elaborating the options page

Next, we can get to work on the _options page_ (options.html). This page lets the user define certain options. Let's look at an example for this extension:
e.g. _As a user, I want to display a message "This is your local environment!" on any URL that begins with "https://localhost"_

In short, we'll give users 3 options for pattern matching:

- URL begins with
- URL contains
- URL ends with

And the following elements of the message should be customisable:

- Text color
- Background color
- Text

We'll also add some info about our extension and place a button to add a new rule. It doesn't do anything yet but stick with it. Finally, we're loading Bootstrap from a CDN for easy styling.

_options.html_

<pre>
  <code class="language-html">
  &lt;!DOCTYPE html&gt;
  &lt;html&gt;
    &lt;head&gt;
      &lt;title&gt;Mistake - Options&lt;/title&gt;
      &lt;link rel="stylesheet" href="./css/bootstrap.min.css"&gt;
      &lt;style&gt;
        h2 {
          margin: 2rem 0;
        }

        p {
          font-size: 1.5rem;
        }

        #add {
          margin-top: 2rem;
          font-size: 1.5rem;
        }

        .rule {
          border-bottom: 1px solid black;
        }

        .rule:last-of-type {
          border-bottom: none;
        }

        button[data-toggle="collapse"] {
          border: none;
          background-color: #fff;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: black;
          display:block; 
          outline: none;
          font-weight: 600; 
          font-size: 1.5rem;
        }

        button[data-toggle="collapse"]:hover, 
        button[data-toggle="collapse"]:visited, 
        button[data-toggle="collapse"]:active,
        button[data-toggle="collapse"]:focus {
          background-color: unset !important;
          color: unset !important;
          border: none;
          outline: 0 !important;
          outline-offset: 0  !important;
          background-image: none  !important;
          -webkit-box-shadow: none !important;
          box-shadow: none  !important;
        }

        .btn-light:focus, .btn-light.focus {
          box-shadow: 0;
        }

        input[type="color"] {
          display: block;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          border: none;
          outline: none;
          -webkit-appearance: none;
        }

        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;	
        }

        input[type="color"]::-webkit-color-swatch {
          border-radius: 50%;
        } 
      &lt;/style&gt;

    &lt;/head&gt;
    &lt;body style="padding-top: 5rem;"&gt;
      &lt;div class="container"&gt;
        &lt;h2&gt;What does Mistake do?&lt;/h2&gt;
        &lt;p&gt;Display a custom message at the top of any webpage that meets the criteria you define.&lt;/p&gt;
        &lt;h2&gt;Why would I want to do such a thing?&lt;/h2&gt;
        &lt;p&gt;Have you ever worked having &lt;strong&gt;multiple tabs of the same application&lt;/strong&gt; open, but in &lt;strong&gt;different environments&lt;/strong&gt;? Then you know how easy it is to live everyone's worst nightmare: screwing things up in production.&lt;/p&gt;
        &lt;p&gt;After yet another near miss, I decided to take matters into my own hands and design this plug-in. Now, when I'm in production, at least I'm significantly reducing the odds of making a &lt;i&gt;Mistake&lt;/i&gt;.&lt;/p&gt;
        &lt;h2&gt;How does it work?&lt;/h2&gt;
        &lt;p&gt;Start by adding a new rule using the button below. Add as many rules as you like.&lt;br/&gt;
        Now, whenever you open a tab with the URL that matches the pattern, your message will be displayed. Et voila!&lt;/p&gt;

        &lt;button type="button" class="btn btn-primary" id="add"&gt;
          Add a new rule
        &lt;/button&gt;

        &lt;div id="rules" style="padding-top: 20px;"&gt;&lt;/div&gt;
        &lt;/div&gt;

        &lt;script src="./js/jquery-3.5.1.slim.min.js"&gt;&lt;/script&gt;
        &lt;script src="./js/popper.min.js"&gt;&lt;/script&gt;
        &lt;script src="./js/bootstrap.min.js"&gt;&lt;/script&gt;
        &lt;script src="config.js"&gt;&lt;/script&gt;
        &lt;script src="helpers.js"&gt;&lt;/script&gt;
        &lt;script src="options.js"&gt;&lt;/script&gt;
    &lt;/body&gt;
  &lt;/html&gt;
  </code>
</pre>

Now we can move on to writing some logic in the Javascript options file (options.js). It consists of 5 important functions:

- _initializeRules_ gets any existing rules from storage on page load and displays them using the _displayRules_ function.
- _createRule_ contains all the HTML and CSS for displaying one specific rule on the options page.
- _saveRule_ saves the information about a rule to storage and displays an alert if it was successful.
- _removeRule_ removes a rule from storage and from the screen.

_options.js_

<pre>
  <code class="language-javascript">
  const buttonAddNewRule = document.getElementById("add");
  const rulesList = document.getElementById("rules");

  window.onload = function () {
    initializeRules();
    buttonAddNewRule.addEventListener("click", createRule);
    rulesList.addEventListener("click", saveRule);
    rulesList.addEventListener("click", removeRule);
  };

  function initializeRules() {
    chrome.storage.sync.get(null, function (syncItems) {
      displayRules(syncItems);
    });
  }

  function displayRules(rules) {
    for (const value of Object.values(rules)) {
      createRule(
        value.type,
        value.expression,
        value.message,
        value.textColor,
        value.backgroundColor
      );
    }
  }

  function createRule(type, expression, message, textColor, backgroundColor) {
    removeActiveAlert();

    const newRule = document.createElement("div");
    newRule.classList.add("rule", "pt-3");
    newRule.setAttribute("data-index", getCurrentNumberOfRules());

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("btn", "btn-light");
    toggleButton.setAttribute("type", "button");
    toggleButton.setAttribute("data-toggle", "collapse");
    toggleButton.setAttribute("data-target", "#collapse" + getCurrentNumberOfRules());
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-controls", "collapse" + getCurrentNumberOfRules());
    if (!type || !expression) { 
      toggleButton.innerText = "New rule (unsaved)";
    } else { 
      toggleButton.innerHTML = `${type} "${expression}" &darr;`;
    }

    const collapseDiv = document.createElement("div");
    collapseDiv.classList.add("collapse", "show", "mb-5");
    collapseDiv.setAttribute("id", "collapse" + getCurrentNumberOfRules());

    const card = document.createElement("div");
    card.classList.add("card", "card-body");

    card.appendChild(createTypeButtonGroup(type));
    card.appendChild(createExpressionInput(expression));
    card.appendChild(createMessageInput(message));
    card.appendChild(createColorInput("textColor", textColor));
    card.appendChild(createColorInput("backgroundColor", backgroundColor));
    card.appendChild(createButton("save"));
    card.appendChild(createButton("remove"));

    collapseDiv.appendChild(card);
    newRule.appendChild(toggleButton);
    newRule.appendChild(collapseDiv);
    rulesList.appendChild(newRule);
  }

  function saveRule(rule) {
    if (rule.target.getAttribute("data-action") === "save") {
      try {
        const ruleTargetParent = rule.target.parentNode;
        const ruleIndex = ruleTargetParent.parentNode.parentNode.getAttribute("data-index");
        const typeArray = ruleTargetParent.getElementsByClassName("active");
        if (typeArray.length !== 1) {
          throw new Error(
            "One and only one rule type should be selected. Please refresh the page and try again."
          );
        }
        const type = typeArray[0].textContent;
        const expression = ruleTargetParent.querySelector('[data-input="expression"]').value;
        const message = ruleTargetParent.querySelector('[data-input="message"]').value;
        const textColor = ruleTargetParent.querySelector('[data-input="textColor"]').value;
        const backgroundColor = ruleTargetParent.querySelector('[data-input="backgroundColor"]').value;

        chrome.storage.sync.set({
          [ruleIndex]: {
            type,
            expression,
            message,
            textColor,
            backgroundColor,
          },
        });

        const toggleButton = ruleTargetParent.parentNode.parentNode.querySelector('[data-toggle="collapse"]');
        toggleButton.innerHTML = `${type} "${expression}" &darr;`;

        displayAlert("success", "The rule was successfully saved!");
      } catch (error) {
        console.log(error);
        displayAlert(
          "danger",
          "The rule could not be saved. Please refresh the page and try again."
        );
      }
    }
  }

  function removeRule(rule) {
    if (rule.target.getAttribute("data-action") === "remove") {
      try {
        const ruleNode = rule.target.parentNode.parentNode.parentNode;
        chrome.storage.sync.remove(ruleNode.getAttribute("data-index"));
        ruleNode.remove();
        displayAlert("success", "The rule was successfully removed!");
      } catch (error) {
        console.log(error);
        displayAlert(
          "danger",
          "The rule could not be removed. Please refresh the page and try again."
        );
      }
    }
  }
  </code>
</pre>

Our content script (content.js) represents the actual work being done by our extension. Every time we navigate to a page, it retrieves all rules from local storage and then checks if the URL of a page we are navigating to matches the pattern which we defined in a rule. If it does, then it will populate a paragraph element and insert it just after the opening &lt;body&gt; tag.

_content.js_

<pre>
  <code class="language-javascript">
  chrome.storage.sync.get(null, function (items) {
    Object.values(items).forEach(function (item) {
      const ruleType = item.type;
      const url = window.location.href;
      const expression = item.expression;
      if (
        (ruleType === "URL begins with" && urlBeginsWith(url, expression)) ||
        (ruleType === "URL contains" && urlContains(url, expression)) ||
        (ruleType === "URL ends with" && urlEndsWith(url, expression))
      ) {
        document.body.prepend(
          createMessage(
            item.font,
            item.message,
            item.textColor,
            item.backgroundColor
          )
        );
      }
    });
  });

  function urlBeginsWith(url, expression) {
    const regex = new RegExp(expression + ".*");
    return regex.test(url);
  }

  function urlContains(url, expression) {
    const regex = new RegExp(".*" + expression + ".*");
    return regex.test(url);
  }

  function urlEndsWith(url, expression) {
    const regex = new RegExp(".*" + expression);
    return regex.test(url);
  }

  function createMessage(font, text, textColor, backgroundColor) {
    const paragraph = document.createElement("p");
    paragraph.style.backgroundColor = backgroundColor;
    paragraph.style.color = textColor;
    paragraph.style.fontFamily = font;
    paragraph.style.textAlign = "center";
    paragraph.style.padding = "1rem 0";
    paragraph.style.fontFamily = "Arial,Helvetica,sans-serif";
    paragraph.style.margin = "0 0 1rem 0";
    paragraph.innerText = text;
    return paragraph;
  }
  </code>
</pre>

In order to separate some of the element creation code, we also have a separate helpers file (helpers.js). The options.js file became too big and just wasn't easily scannable anymore. Those helper functions are mainly focused on creating the DOM elements for the options page.

_helpers.js_

<pre>
  <code class="language-javascript">
  function createTypeButtonGroup(value) {
    const typeButtonGroup = document.createElement("div");
    typeButtonGroup.classList.add("btn-group", "btn-group-toggle", "mb-3");
    typeButtonGroup.setAttribute("data-toggle", "buttons");
    typeButtonGroup.setAttribute("data-purpose", "type");

    // Create dropdown options based on RULE_TYPE_OPTIONS array
    for (i = 0; i < RULE_TYPE_OPTIONS.length; i++) {
      const typeOptionLabel = document.createElement("label");
      typeOptionLabel.classList.add("btn", "btn-secondary");
      typeOptionLabel.textContent = RULE_TYPE_OPTIONS[i];

      const typeOptionInput = document.createElement("input");
      typeOptionInput.setAttribute("type", "radio");
      typeOptionInput.setAttribute("name", "options");
      typeOptionInput.setAttribute("id", "option" + (i + 1));

      if (value === RULE_TYPE_OPTIONS[i]) {
        typeOptionInput.checked = true;
        typeOptionLabel.classList.add("active");
      }

      typeOptionLabel.appendChild(typeOptionInput);
      typeButtonGroup.appendChild(typeOptionLabel);
    }
    return typeButtonGroup;
  }

  function createExpressionInput(expression) {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group", "mb-3");

    const inputGroupPrepend = document.createElement("div");
    inputGroupPrepend.classList.add("input-group-prepend");

    const inputGroupText = document.createElement("span");
    inputGroupText.classList.add("input-group-text");
    inputGroupText.innerText = "String:";
    inputGroupPrepend.appendChild(inputGroupText);

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    input.setAttribute("placeholder", "https://www.example.com");
    input.setAttribute("aria-label", "URL");
    input.setAttribute("minlength", "1");
    input.setAttribute("maxlength", "255");
    input.setAttribute("data-input", "expression");
    if (expression) {
      input.value = expression;
    }

    inputGroup.appendChild(inputGroupPrepend);
    inputGroup.appendChild(input);

    return inputGroup;
  }

  function createMessageInput(message) {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group", "mb-3");

    const inputGroupPrepend = document.createElement("div");
    inputGroupPrepend.classList.add("input-group-prepend");

    const inputGroupText = document.createElement("span");
    inputGroupText.classList.add("input-group-text");
    inputGroupText.innerText = "Message:";
    inputGroupPrepend.appendChild(inputGroupText);

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    input.setAttribute("placeholder", "Hi there!");
    input.setAttribute("minlength", "1");
    input.setAttribute("maxlength", "255");
    input.setAttribute("aria-label", "Message");
    input.setAttribute("data-input", "message");
    if (message) {
      input.value = message;
    }

    inputGroup.appendChild(inputGroupPrepend);
    inputGroup.appendChild(input);
    return inputGroup;
  }

  function createColorInput(colorType, color) {
    const div = document.createElement("div");
    div.classList.add("mb-3");

    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "color");
    input.setAttribute("width", "50");

    if (colorType === "textColor") {
      label.setAttribute("for", "textColor");
      label.innerText = "Text color:";
      input.setAttribute("data-input", "textColor");
      input.setAttribute("aria-label", "Text color");
      input.defaultValue = DEFAULT_TEXT_COLOR;
    }
    if (colorType === "backgroundColor") {
      label.setAttribute("for", "backgroundColor");
      label.innerText = "Background color:";
      input.setAttribute("data-input", "backgroundColor");
      input.setAttribute("aria-label", "Background color");
      input.defaultValue = DEFAULT_BACKGROUND_COLOR;
    }
    if (color) {
      input.value = color;
    }

    div.appendChild(label);
    div.appendChild(input);
    return div;
  }

  function createButton(type) {
    if (type === "save") {
      const saveButton = document.createElement("button");
      saveButton.innerText = "Save";
      saveButton.classList.add("btn", "btn-primary", "mb-3", "mt-3");
      saveButton.setAttribute("data-action", "save");
      return saveButton;
    }

    if (type === "remove") {
      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      removeButton.classList.add("btn", "btn-danger", "mb-3");
      removeButton.setAttribute("data-action", "remove", "mt-3");
      return removeButton;
    }
  }

  function displayAlert(type, text) {
    removeActiveAlert();
    const newAlert = document.createElement("div");
    newAlert.setAttribute("role", "alert");
    newAlert.innerText = text;
    if (type === "success") {
      newAlert.classList.add("alert", "alert-success");
    }
    if (type === "danger") {
      newAlert.classList.add("alert", "alert-danger");
    }
    document.body.prepend(newAlert);
    setTimeout(function () {
      newAlert.remove();
    }, 2000);
  }

  function removeActiveAlert() {
    const activeAlert = document.getElementsByClassName("alert");
    if (activeAlert.length > 0) {
      activeAlert[0].remove();
    }
  }

  function getCurrentNumberOfRules() {
    return parseInt(document.querySelectorAll(".rule").length, 10);
  }
  </code>
</pre>

Last but not least, we'll also add a config file (config.js) so we can easily extend with more patterns or change default values in the future.

_config.js_

<pre>
  <code class="language-javascript">
  const RULE_TYPE_OPTIONS = ["URL begins with", "URL contains", "URL ends with"];
  const DEFAULT_TEXT_COLOR = "#ffffff";
  const DEFAULT_BACKGROUND_COLOR = "#dc3545";
  </code>
</pre>

## Extending the extension

So that was basically all the code needed to develop this Chrome extension. Ofcourse, this is the most simple form it could take and there's a lot of room for improvement. To name a few possible adjustments:

- When adding a new rule, it should also check if there are any open tabs that match the pattern of that new rule and immediately insert the paragraph. Now, you'll need to refresh the page.
- Add more customization options: font family, font size, adding images ...
- The message is currently prepended to the &lt;body&gt;. That might produce unwanted results depending on the DOM structure. More testing on multiple (types of) websites and web applications is needed to discover gaps.
- ...

Hope you liked it! <a href="mailto:karel.de.smet@outlook.com">Drop me a line</a> if you have some questions or remarks.
