---
layout: layouts/article-layout.njk
title: 'Develop a QR/barcode scanner'
date: 2021-05-24
tags: ['article']
preview: 'Should you use ZXing or the Barcode Detection API?'
description: "Learn how to create an app to scan QR/bar codes with a laptop's webcam or smartphone's camera"
---

# {{ title }}

## TL;DR

I've built 3 demo apps, each of which can scan (nearly) any type of QR code or barcode, with a mobile device's camera or the webcam from a desktop or laptop. They all make use of a different API or library. 

1. Barcode Detection API: [demo app](https://heroic-pixie-920d9f.netlify.app/) / [Github repo](https://github.com/carlos-ds/scanner-barcode-detection-api)
2. ZXing for JS: [demo app](https://thriving-daifuku-76efc9.netlify.app/) / [Github repo](https://github.com/carlos-ds/scanner-zxing-js-browser)
3. NGX scanner (Angular port from ZXing): [demo app](https://moonlit-cassata-785f18.netlify.app/) / [Github repo](https://github.com/carlos-ds/zxing-js-ngx-scanner)

## The bigger picture

In essence, it's pretty simple. We need to:

* Capture the video stream from our user's camera or webcam.
* Provide (images from) that stream to an API, which will detect if there are codes present.

*Can I build that API myself?*

You could, but it would probably take an outrageous amount of effort, because:

- **Image recognition** is not something to be taken lightly.
- There is a bewildering amount of code **formats**, both one-dimensional (actual *bar* codes) and two-dimensional (e.g. QR codes). 
- Each format can have multiple **variants** depending on the use case.
- Barcodes and QR codes might look like a random combination of lines and squares. However, **check digits, start and stop characters** add up to the complexity.

Luckily, there are plenty of options available that have done the hard work for you.

## Barcode Detection API

Believe it or not, there is a **Web API** that allows you to scan a multitude of code types. Meet the [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API).

### The good news

Well, it is relatively **easy to use**! Duck soup, cakewalk, child's play ... you get it. 

I've strung together an unstyled [demo app](https://heroic-pixie-920d9f.netlify.app/). Check out the [Github repo](https://github.com/carlos-ds/scanner-barcode-detection-api) for the source code.

Upon loading the demo page, you should be prompted for access to your video device. Once allowed, a video stream of your device should be playing. 

Find yourself a barcode or QR code and scan away. Results found are logged at the bottom of the page. 

The API support a considerable amount of **formats**. I haven't found any barcode in or around my house or at work which could not be detected. Ofcourse, I'm not an expert and the different formats and their respective market shares and use cases could be the topic of another article. 

### The bad news

The example above doesn't work as expected? You just discovered the major caveat of the Barcode Detection API: **compatibility**. 

For starters, support is [limited to recent versions of Chrome, Edge or Opera](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#browser_compatibility). You heard it right: **no support in Firefox, Internet Explorer nor Safari**. A sizeable chunk of your audience perhaps?

To make that slice even smaller, barcode detection is only [available on macOS, Chrome OS, and Android](https://web.dev/shape-detection/). No support for (or from?) Windows, iOS or Linux-based OS'es whatsoever. Bummer!

## Zebra Crossing (ZXing)

Back on your feet after that compatibility blow? Let me introduce you to [ZXing](https://github.com/zxing/zxing), short for **'Zebra Crossing'**.

### The good news

There's probably a port for your favorite programming language listed somewhere on ZXing's Github readme. Since the main project is now in maintenance mode, consider numerous ports a good thing.

If you're a happy front-end dude, you'll probably want to look into the Javascript/Typescript port, [ZXing for JS](https://github.com/zxing-js). 

Again, fairly easy to get started:

* Use `navigator.mediaDevices.getUserMedia` to capture the user's video stream
* Set the captured stream as the source for a `&lt;video&gt;` element.
* Provide the stream to ZXing by passing the video element to `decodeFromVideoElement`

I've made a [demo app](https://thriving-daifuku-76efc9.netlify.app/) for which you can find the code on [Github](https://github.com/carlos-ds/scanner-zxing-js-browser).

As you can see, we don't need to manually take images from our video stream every x amount of time as with the Barcode Detection API. ZXing is doing that work for us. 

ZXing also supports a [couple of extra formats](https://github.com/zxing-js/library/blob/master/src/core/BarcodeFormat.ts) compared to the Barcode Detection API.

For **Angular** developers, there's even better news called [ngx-scanner](https://github.com/zxing-js/ngx-scanner). This lets you **import ZXing as a component** into your Angular project. The [Wiki](https://github.com/zxing-js/ngx-scanner/wiki/Getting-Started) should be just enough to get you up and running.

Again, here's an unstyled [demo app](https://moonlit-cassata-785f18.netlify.app/) and the accompanying [Github repo](https://github.com/carlos-ds/zxing-js-ngx-scanner). 

### The not so good news

Questions arise regarding how well ZXing for JS and its libraries are maintained. Don't get me wrong, I don't want to criticize. We can all play our part by contributing and I'm sure the maintainers are doing an excellent job. 

Nonetheless, I've encountered some problems:

* Upon installing the projects dependencies via npm, security vulnerability warnings are eminent.
* Support for Angular 11 seems lacking, given the number of issues that have been opened in that domain. Similar to one of the comments [in this issue](https://github.com/zxing-js/ngx-scanner/issues/399), I've had to downgrade the version to get things rolling.
* Documentation is minimal, often without a description of the available methods and possible examples.

## Considerations

Upon using these demo apps, and other demo apps for that matter, you might find the scanning quality (how many times the correct code is detected vs how much time it is actually present in the camera's view) is rather limited. 

That's mainly due to some environmental and hardware-related considerations. You can find most of them listed on [this readme from Instascan](https://github.com/schmich/instascan#performance) (another port from ZXing). Auto-focus, scanning angles, resolution, lighting ... All these factors can increase or decrease your chances of detection. It's up to you to increase them as much as possible.

## Conclusion

How long does it take to build a web app that can scan barcodes or QR codes with your laptop or smartphone's camera? Not very long. 

Yet, if you're looking for a future-proof solution, you might have to get your hands wet in contributing. And be prepared to help your users in overcoming common problems.
