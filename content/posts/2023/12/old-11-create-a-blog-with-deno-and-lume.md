---
title: Create a blog with Deno and Lume
author: furiouzz
draft: true
tags:
  - javascript
  - deno
  - lume
---

For my first post, I made the choice to explain why I created a blog and how to create one with Lume and Deno.

<!-- more -->

## Why do I need a blog?

I love tech and I spend a lot of time in reading articles and repositories. After quite a time, I feel frustrated to do not sharing what I learnt and what I experimented. I created this blog share knowledges. I want to improve my writing skills and to take the habits to explain things. And I want to keep my side projects visible into an article.

So now the decision is taken, let's create a blog.

## Let's create blog

Creating this blog is a perfect side project to try Deno. Here the stack:
* [Deno](https://deno.land/), the Javascript Runtime
* [Lume](https://lume.land), the static site generator using Deno
* [Github](https://github.com/), the source code host
* [Deno Deploy](https://deno.land/deploy/), the website host


### Setup Lume

To begin, you need to install Deno.

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

**Note: If you need an alternative method you can follow the [installation guide](https://docs.deno.com/runtime/manual/getting_started/installation) from the official website.**

Once Deno is installed, you will create two directories:
* `content` directory will store the blog content, eg. posts and pages
* `.lume` directory will store Lume files

```bash
mkdir content
mkdir .lume
```

And two files:
* `.lume/config.ts` file stores Lume configuration
* `deno.json` file stores Deno configuration

```bash
touch .lume/config.ts
touch deno.json
```

Then inside the `content` directory, you will create `posts` directory and `pages` directory.

```bash
mkdir content/posts
mkdir content/pages
```

To setup Lume, you need to write your `deno.json`.

In `imports` field you configure [import map](https://docs.deno.com/runtime/manual/basics/import_maps) and in `tasks` field you add your script commands.

```json
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

In the `imports` field, we mapped:
* `lume/` to the version `2.0.1` of Lume
* `blog/` to the version `0.10.2` of [theme-simple-blog](https://github.com/lumeland/theme-simple-blog)

You are ready to edit `.lume/config.ts`. The configuration is pretty simple:

```ts
import lume from "lume/mod.ts";
import blog from "blog/mod.ts";

const site = lume({ dest: ".lume/dist" });

site.use(blog());

export default site;
```

Alternatively, without the `imports` field, `.lume/config` may look like this:

```ts
import lume from "https://deno.land/x/lume@v2.0.1/mod.ts";
import blog from "https://deno.land/x/lume_theme_simple_blog@v0.10.2/mod.ts";

const site = lume({ dest: ".lume/dist" });

site.use(blog());

export default site;
```

Let's try to see our blog:

```bash
deno task serve
```

You may find your static website generated in `.lume/dist` and see your blog in `http://localhost:3000/`.

### Add blog post

To add a blog post, you have to create a markdown file inside `content/posts`.
For example, let's create `content/posts/2023-12-first-post.md` with this content:

```markdown
---
title: First post
type: post
layout: layouts/post.vto
basename: ../
metas:
  title: "=title"
---

This is my first post.
```

Let take some time to detail the frontmatter:
* `title` field is the title of the post
* `type` field is required by [theme-simple-blog](https://github.com/lumeland/theme-simple-blog) to consider this file as a post.
* `layout` field indicate which layout from [theme-simple-blog](https://github.com/lumeland/theme-simple-blog) to use
* `basename` field override the post url. Without this field, you will access to the post to the path `/content/posts/2023-12-first-post.md`. I want to remove `/content` basename so I set `../`. Read [Lume documentation](https://lume.land/docs/creating-pages/urls/#basename) for more information.
* `metas` field to set website metadata

Most of these field can be reused with all posts. You can move some them to `content/posts/_data.yml` if we follow [Lume documentation](https://lume.land/docs/getting-started/shared-data/).

```yml
type: post
layout: layouts/post.vto
basename: ../
metas:
  title: "=title" # Alias to post title
```

Now our post is a bit more lighter:

```markdown
---
title: First post
---

This is my first post.
```

**Note: Creating `content`, `content/posts` and `content/pages` directories is my file structure. Lume watchs every files and directories excepted ones starting with `.` and `_`. So you can organise as yo want. You only need to precise the field `type: post` and `layout: layouts/post.vto` in your data to be interpreted as a blog post by theme-simple-blog.**

### Add a page

Create a new page inside `content/pages/`, for example `content/pages/about.md`:

```bash
---
title: About
menu:
  visible: true
  order: 2
---

Let's talk about me.
```

With the `menu` field, you can make the page visible in the menu and reorder pages.

### Change blog title

Create `_data.yml` at the root of your blog directory.

```yml
lang: en

home:
  welcome: Hello, I am a person that writes stuff.

# Metas plugin https://lume.land/plugins/metas/#description
metas:
  site: Blog example
  description: This is an example of a Lume blog theme
  twitter: "@misteroom"
  lang: "=lang"
```

Your file structure must look like this:

```bash
.
├── .lume/
│   └── config.ts
├── content/
│   ├── posts/
│   │   ├── _data.yml
│   │   └── 2023-12-first-post.md
│   └── pages/
│       ├── _data.yml
│       └── about.md
├── _data.yml
├── deno.json
└── deno.lock
```

### Deploy our blog

Open a new tab to [Deno Deploy](https://deno.land/deploy) and log in with your Github account.

You need to follow these steps:
* Create a new project
* Select your organisation and repository from Github
  * You may need to give some access to Deno Deploy
* Select `Build Step with Github Actions`
* Click on `Create & Deploy`

You have to create `.github/workflows/deploy.yml` file with a configuration similar the one below.

```yml
name: Deploy
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    permissions:
      id-token: write # Needed for auth with Deno Deploy
      contents: read # Needed to clone the repository

    steps:
      - name: Clone repository
        uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Install Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: lts/*

      - name: Build step
        run: deno task build

      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: YOUR-PROJECT
          entrypoint: .lume/serve.ts
```

You need to edit the last step:
  * Set `project` field with your project name
  * Set `entrypoint` field with `.lume/serve.ts`

Then create `.lume/serve.ts`

```ts
import Server from "lume/core/server.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/.lume/dist`,
});

server.start();

console.log("Listening on http://localhost:8000");
```

Push your code and wait the end of your Github Actions job.

Your website must be available at a link similar to `YOUR-PROJECT.deno.dev`.

## What's next?

Together we created a blog with Deno and Lume. Then we made it available online with Deno Deploy. You are ready to write some articles and share your writings.

Creating a blog with Lume is very simple and deploy with Deno Deploy even more!

For more information, I invite you to:
* Read [Lume documentation](https://lume.land/docs/overview/about-lume/)
* Fork [theme-simple-blog](https://github.com/lumeland/theme-simple-blog/tree/main)
* Experiment with [Deno](https://deno.com/)

Please, do not hesitate to leave a comment or send me a message  [@furiouzz](https://twitter.com/furiouzz).
