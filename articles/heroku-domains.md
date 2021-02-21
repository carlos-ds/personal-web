---
layout: layouts/article-layout.njk
title: 'Connecting a domain to Heroku'
date: 2021-01-31
tags: ['article']
preview: 'Fiddling with DNS records.'
description: 'Learn how to connect your domain name to a Heroku application by managing Heroku settigns and adding the necessary DNS records.'
containsCodeSnippet: true
---

# {{ title }}

My [IBAN generator app](https://iban-generator.be) runs on Heroku. And it was time to connect it to a custom domain: _iban-generator.be_.

I went up to [Easyhost](https://www.easyhost.be/nl/), bought myself the .be domain name for a penny and went over to [Heroku's documentation on domain names](https://devcenter.heroku.com/articles/custom-domains).

Briefly put, we first need to **generate a DNS target** for our app by adding our domain to Heroku. We'll explain this using the Heroku CLI, but you can just use the dashboard as well.

In the second step, we'll link our domain name to that DNS target by **configuring a DNS record**.

## Step 1: generate a DNS target

The Heroku documentation contains a section ["Add a custom root domain"](https://devcenter.heroku.com/articles/custom-domains#add-a-custom-root-domain) which can guide you through. However, there's a lot of redundant information in there for our use case (= linking the root domain), we'll keep it concise.

First, make sure you have the Heroku CLI installed:

<pre>
<code class="language-javascript">
heroku 
// VERSION heroku/7.44.0 win32-x64 node-v12.16.2
</code>
</pre>

Fire up the console and execute the command to add your domain.

<pre>
<code class="language-javascript">
heroku domains:add iban-generator.be
// Warning: heroku update available from 7.44.0 to 7.47.6. 
// » Error: Missing required flag: » -a, --app APP app to run command against 
// » See more help with --help
</code>
</pre>

I'm not sure why Heroku doesn't mention the app flag by default in their documentation. But before we continue, let's update the Heroku CLI.

<pre>
<code class="language-javascript">
heroku update
// heroku: Updating CLI from 7.44.0 to 7.47.6... done 
// heroku: Updating CLI... done
</code>
</pre>

Then run the <code class="inline-code">domains:add</code>command again and add the app name as a flag.

<pre class="language-javascript">
<code class="language-javascript">
heroku domains:add iban-generator.be -a iban-angular
// Configure your app's DNS provider to point to the DNS Target aquatic-capybara-olp1u7v4njybio2x5citjbwd.herokudns.com. 
// For help, see https://devcenter.heroku.com/articles/custom-domains
// The domain iban-generator.be has been enqueued for addition 
// Run heroku domains:wait 'iban-generator.be' to wait for completion 
// Adding iban-generator.be to ⬢ iban-angular... done
</code>
</pre>

You can find the name for your app in the Heroku dashboard. Here, it's named _iban-angular_. It's also the subdomain name of herokuapp.com that points to your application.

Verify everything was added correctly by running:

<pre class="language-javascript">
<code class="language-javascript">
heroku domains -a iban-angular
// === iban-angular Heroku Domain 
// iban-angular.herokuapp.com
// === iban-angular Custom Domains 
// Domain Name         DNS Record Type     DNS Target 
// iban-generator.be   ALIAS or ANAME      aquatic-capybara-olp1u7v4njybio2x5citjbwd.herokudns.com
</code>
</pre>

## Step 2: Configure an ALIAS DNS record

Next, go to your domain name provider's dashboard and set up an **ALIAS** record. These are also sometimes known as ANAME or FLATTENING records and they are meant to set an alias for your **root domain**.

As opposed to the better known **CNAME** records which set up an alias for a **subdomain**.

Heroku clearly states in the documentation: not all domain name providers allow you to set up an ALIAS record. Take that into account when picking a domain name provider.

If you do have the possibility to add an ALIAS record, navigate to the control panel of your domain name provider and add the DNS target generated in the previous step. So most likely, you'll have to provide 3 parameters:

- Record: _iban-generator.be_
- Destination: _aquatic-capybara-olp1u7v4njybio2x5citjbwd.herokudns.com_
- TTL: _3600_

I left **TTL** (time to live) to the default value. Optimizing this is not my cup of tea, but there's a [proper guide on varonis.com](https://blogvaronis2.wpengine.com/dns-ttl/) in case you're wondering.

## Step 3: Testing

The final step is easy: navigate to your domain name and see if it resolves to your Heroku application. If it doesn't, don't panic. It might take some time before the DNS changes have propagated.

If it takes more than 2 hours, check the control panel of both Heroku and your domain name provider to see if you've entered everything correctly. Or contact your domain name provider for support.
