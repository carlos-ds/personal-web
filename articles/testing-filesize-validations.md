---
layout: layouts/article-layout.njk
title: 'Testing filesize validations'
date: 2025-02-01
tags: ['article', 'featured']
preview: 'About error 413, Retry-After and mkfile'
description: 'Read about HTTP status code 413,the  Retry-After response header and learn to create an empty file of any size and type.'
containsCodeSnippet: true
---

# {{ title }}

If you are regularly creating or testing forms that allow the user to upload a file, you'll want to test the filesize validation.

When you submit a form with a `<input type="file">` element, it will send the files to the back-end as a **multipart type**. 
This means the document is broken into pieces, and each individual piece can be transmitted separately.

## 413 Payload Too Large

Most API frameworks will have a sensible default for the maximum filesize. 
For example, Spring Boot has a default maximum of 1MB per file.

However, a lot of applications allow users to upload much larger files e.g. 20MB. 
If users do cross that threshold, the server will respond with a [413 Payload Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413) error.

### Retry-After

Optionally, the server can respond with a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header. 
This can be useful if users are surpassing a periodic quotum (e.g. 200MB per day), or when there is a temporary reason for the error.

### Testing the API response

Suppose you're a front-end developer and have just finished developing a form that lets the user upload a PDF.
The back-end developer told you that they will only accept files smaller than or equal to 20 MB. 
But you don't have any PDF's lying around that are larger than 20 MB (who does?) to test this. What do you do?

### mkfile

On MacOS or Linux, you can just create a new empty file with a pre-defined filesize from the terminal using [mkfile](https://ss64.com/bash/mkfile.html).

```shell
mkfile 21m 21mbfile.pdf
```

Just note that this file will not have the correct (.pdf) header. So if back-end is also validating the header of the file, it might still throw an error.

Happy developing!







