---
title: Create a blog with Deno and Lume
author: furiouzz
tags:
  - javascript
  - deno
  - lume
excerpt: |
  For my first post, let's focus on how I created a blog with Deno and Lume.
---

I love tech : spending time in articles reading, codes writing and experiments.
After years of hesitation, I felt the need to share what I learnt and what I experimented.
I wanted to improve my writing skills and discipline myself to writing.
I was looking for a way to express myself and to save my reflexions into a text, an article, a blog.
And there it is : I created a blog. Welcome to my blog !

## What will we talk about?

Blogging of course!

More importantly we will talk about how set up a blog and get it running locally.

To get there, we are going to use:
  * [Deno](https://deno.land/) - a Javascript Runtime easy to use, faster to setup and very powerful
  * [Lume](https://lume.land) - a static site generator using Deno under the wood
  * [Simple Blog](https://github.com/lumeland/theme-simple-blog) - a theme for Lume configured for blogging

Creating a blog is a perfect side project to try these projects.

So in this post, you will learn to:
  * Create the project structure
  * Configure Deno and Lume
  * Start a server locally to see your blog
  * Customize your blog
  * Create a page
  * Create a post

When I created this blog, it was important for me to start writing quickly and not to spend too much time in configuration and customisation. The objective at the end: being focused on writing.

Let's start!

## Create the project structure

Let's create the root directory. Why not call our blog `my-blog`.

Then follow the given directory structure below:

```bash
my-blog/
├── .lume/
│   └── config.ts
├── content/
│   ├── posts/
│   │   └── _data.yml
│   └── pages/
│       └── _data.yml
├── _data.yml
└── deno.json
```

I will explain the role of these directories and files in the next section.

## Setup Lume

Now in this section we will:
  * Install [Deno](https://deno.land)
  * Edit `my-blog/deno.json`
  * Edit `my-blog/.lume/config.ts`
  * Launch Lume server

Remember, in this post, we are not creating a blog from scratch. We want to set it up once and be ready to write.

So we will configure Lume to use [Simple Blog](https://github.com/lumeland/theme-simple-blog) theme.

First you need to install Deno. I invite you to follow the [installation guide](https://docs.deno.com/runtime/manual/getting_started/installation) before going further.

Once this is done, let's edit `my-blog/deno.json`, the Deno configuration file.

```json
// my-blog/deno.json
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v2.0.1/",
    "blog/": "https://deno.land/x/lume_theme_simple_blog@v0.10.2/"
  },
  "tasks": {
    "lume": "echo \"import 'lume/cli.ts'\" | deno run --unstable -A - --config .lume/config.ts",
    "build": "deno task lume",
    "serve": "deno task lume -s"
  }
}
```

Let me explain in detail what is written above:
  * The `imports` field is used to configure the [import maps](https://docs.deno.com/runtime/manual/basics/import_maps)
  * The `tasks` field is used to register scripts

Before we start our Lume server locally, we will edit `my-blog/.lume/config.ts`. The configuration is quite simple:

```ts
// my-blog/.lume/config.ts
import lume from "lume/mod.ts";
import blog from "blog/mod.ts";

const site = lume({
  dest: ".lume/dist" // Change destination directory
});

site.use(blog()); // Use simple-blog theme

export default site;
```

We are so close to seeing what our blog look like. One more step: start the server !

```bash
deno task serve
```

TADA! Your blog is live (locally) at [http://localhost:3000/](http://localhost:3000/).

![Blog running locally](../../../assets/blog-offline.png)

## Customize our blog

Let's edit `my-blog/_data.yml`

```yaml
lang: en

home:
  welcome: Here my welcome message

# Metas plugin https://lume.land/plugins/metas/#description
metas:
  site: My Blog
  description: An example of description
  twitter: "@furiouzz"
  lang: "=lang"
```

![Blog running locally](../../../assets/blog-customize.png)


## Create a page


## Create a post


