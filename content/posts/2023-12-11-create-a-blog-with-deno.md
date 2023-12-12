---
title: Create a blog with Lume and Deno Deploy
author: furiouzz
tags:
  - javascript
  - deno
---

For this first post, I thought it would be a good exercice to explain how to created this blog with [Lume](https://lume.land/) and to host on [Deno Deploy](https://deno.com/deploy).

<!-- more -->

## Why do I need a blog?

* Share technical knowledge
* Take the habits to explain things
* Write something frequently

## Create your blog

* Looking for an opportunity to use [Deno](https://deno.land/) in a side project
* Chose [Lume](https://lume.land/) as my static site generator
  * Few configurations required and good defaults
  * Framework agnostic
  * Highly customizable
* Created a fork of [lumeland/theme-simple-blog](https://github.com/FuriouZz/theme-simple-blog)
  * Add [giscus](https://giscus.app/) as my comment system

## File architecture

```
...
├── _config.ts
├── _data.yml
├── _site
├── _submodules
├── content
|  ├── pages
|  |  ├── _data.yml
|  |  └── about.md
|  └── posts
|     ├── _data.yml
|     └── 2023-12-11-create-a-blog-with-deno.md
├── deno.json
├── deno.lock
└── serve.ts
```

## Deploy your website

*

