---
date: 2024-02-01
metas:
  description: |
    Some description here
author: furiouzz
tags:
  - javascript
  - deno
  - lume
---

Last month we talked about [how to create a blog with Deno and Lume](/posts/how-to-create-a-blog-with-deno-and-lume). Now we will make it accessible publicly with [Deno Deploy](https://deno.com/deploy).

<!-- more -->

To follow this post, you need a file structure similar to the one created in my [previous post](/posts/how-to-create-a-blog-with-deno-and-lume#create-files-and-directories). Let me remind you how it looks like:

```bash
my-awesome-blog/
├── .lume/
│   └── config.ts
├── content/
│   ├── posts/
│   │   ├── _data.yml
│   │   └── 2024-01-01.md
│   └── pages/
│       ├── _data.yml
│       └── about.md
├── _data.yml
└── deno.json
```

We used [Lume](https://lume.land), a static site generator, to generate our blog. The `deno task build` command generate `.lume/_site/` directory. Our objective is to execute a web server which will serve this directory.

Lume has an interesting [Deployment section](https://lume.land/docs/advanced/deployment/) for deployment on most popular services, including [Deno Deploy](https://deno.com/deploy). However in this post, we will not use [denoland/deployctl](https://github.com/denoland/deployctl/tree/main/action) but the command-line of the same name [deployctl](https://github.com/denoland/deployctl). I want this tutorial to be adaptable to any remote repository and any CI/CD.

::: quote warning
At the time we are writing, you need a Github account to use Deno Deploy. On the other hand, you can host your source code wherever you want.
:::

Here our plan:
1. Update our file architecture
2. Launch our first deployment locally
3. Automate deployment with a Github workflow

## File architecture

In our targeted file architecture, we will create two new files:
* `.lume/entry-point.ts` is the script executed by Deno Deploy
* `.github/workflows/deploy.yml` is our Github workflow for site generation and deployment

```bash
my-awesome-blog/
├── .github/
│   └── workflows/
│   │   └── deploy.yml # [!code ++]
├── .lume/
│   ├── entry-point.ts # [!code ++]
│   └── config.ts
├── content/
│   ├── posts/
│   │   ├── _data.yml
│   │   └── 2024-01-01.md
│   └── pages/
│       ├── _data.yml
│       └── about.md
├── _data.yml
└── deno.json
```

::: quote warning
Do not forget to add `.lume/_site/` directory to your `.gitignore` file.
:::

## First deployment

::: quote
What is [Deno Deploy](https://deno.com/deploy) ? This is a service for hosting Javascript application. Your application is hosted on server geographically close to your users, which enable low latency and fast response times.
:::

Take the following steps to configure [deployctl](https://github.com/denoland/deployctl):
* Setup `.lume/entrypoint.ts`
* Create a `deploy` task in `deno.json`
* Add deployment configuration in `deno.json`
* Generate an access token on Deno Dashboard

Let's start with our entry point. The entry point will start a web server which will serve `.lume/_site/` directory. We will later use this server to generate page [on demand](https://lume.land/plugins/on_demand/).

Edit `.lume/entry-point.ts`:

```ts {label=my-awesome-blog/.lume/entry-point.ts}
import Server from "https://deno.land/x/lume@v2.0.2/core/server.ts";

const port = 8000;

const server = new Server({
  root: `${Deno.cwd()}/.lume/_site`,
  port,
})

server.start();

console.log(`Listening on http://localhost:${port}`);
```

Now we will create our `deploy` task:

```json {label=my-awesome-blog/deno.json}
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v2.0.1/",
    "blog/": "https://deno.land/x/lume_theme_simple_blog@v0.10.2/"
  },
  "tasks": {
    "deploy": "deno run --env -A https://deno.land/x/deploy/deployctl.ts deploy", // [!code ++]
    "lume": "echo \"import 'lume/cli.ts'\" | deno run --unstable -A - --config .lume/config.ts",
    "build": "deno task lume",
    "serve": "deno task lume -s"
  }
}
```

Now we will add a new `deploy` field which will contains following configurations:
* `project` is the name of your project. It can be whatever you want. If you omit this field, `deployctl` will generate a name for you will set the project id to this field.
* `entrypoint` targets the script file executed by Deno Deploy.
* `include` lists files and directories to be deployed.
* `exclude` list files and directories to not be deployed.

```json {label=my-awesome-blog/deno.json}
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v2.0.1/",
    "blog/": "https://deno.land/x/lume_theme_simple_blog@v0.10.2/"
  },
  "deploy": { // [!code ++]
    "project": "YOUR_PROJECT_NAME", // [!code ++]
    "entrypoint": ".lume/entry-point.ts", // [!code ++]
    "include": [ // [!code ++]
      "./.lume/entry-point.ts", // [!code ++]
      "./.lume/_site" // [!code ++]
    ], // [!code ++]
	"exclude": [ // [!code ++]
      "**/node_modules" // [!code ++]
    ] // [!code ++]
  }, // [!code ++]
  "tasks": {
    "deploy": "deno run --env -A https://deno.land/x/deploy/deployctl.ts deploy",
    "lume": "echo \"import 'lume/cli.ts'\" | deno run --unstable -A - --config .lume/config.ts",
    "build": "deno task lume",
    "serve": "deno task lume -s"
  }
}
```


Here our last step. Go to [account settings](https://dash.deno.com/account#access-tokens), then look for **Access tokens** section. Click on **New Access Token** button.

![access tokens section with new acces token button](../assets/2024/01/new-access-token.png){transform-images="avif webp jpg 800@2"}

Once generated, open a terminal and write the command below with your access token:

```bash
$ export DENO_DEPLOY_TOKEN=YOUR_ACCESS_TOKEN_HERE
```

Now we are ready to execute our first deployment:

```bash
$ deno task deploy
```

Tada :tada:! Your blog is deployed.

You may have an output similar to the one below:

```bash
✔ Production deployment complete.
✔ Updated config file '/workspaces/my-awesome-blog/deno.json'.

View at:
 - https://YOUR_PROJECT_NAME-DEPLOYMENT_ID.deno.dev
 - https://YOUR_PROJECT_NAME.deno.dev
```

For the creation of a project, `deployctl` has two actions:
* Create a new deployment accessible at `https://YOUR_PROJECT_NAME-DEPLOYMENT_ID.deno.dev/`
* If this is the first deployment, the created deployment is promoted to **production** and is accessible at `https://YOUR_PROJECT_NAME.deno.dev/`

If you edit one of your page and execute `deno task deploy` a second time, you may notice that  URL is created with a different `DEPLOYMENT_ID`. Your page does not have if you visit `https://YOUR_PROJECT_NAME.deno.dev/`. Your new deployment has not been promoted to **production**. To solve this issue, you can run `deno task deploy --prod` to promote the deployment to **production**.

## Automate deployment

To automate our deployment, we will create a CI/CD pipeline. CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. You are free to use any CI/CD pipeline. In this post, we will create a Github workflow.

In this section, we will follow theses steps to setup our Github workflow:
1. Save our access token into a secret
2. Configure workflow triggers
3. Create a `build` job for site generation
4. Create a `deploy` job for deployment

Let's create our secret!

Click on **Settings**, the button is placed in the navigation bar of your repository.

![Settings button on Github repository](../assets/2024/01/github-settings.png){transform-images="avif webp jpg 800@2"}

On navigation on the left, look for the **Security** section, unfold **Secrets and variables** and click on **Actions**.

![](../assets/2024/01/github-secrets-variables.png){transform-images="avif webp jpg 400@2" width="100%" height="300" style="object-fit: contain;"}

Click on `New repository secret`.

![](../assets/2024/01/github-new-secret.png){transform-images="avif webp jpg 400@2" width="100%" height="300" style="object-fit: contain; object-position: center"}

Specify `DENO_DEPLOY_TOKEN` in the name field and set your access token in the value field. Then click on the `Add secret` button.

Now let's edit `github/workflows/deploy.yml`. To start this workflow is triggered:
* when we push to the `main` branch
* when we push to a pull request targeting the `main` branch

```yml {label=my-awesome-blog/.github/workflows/deploy.yml}
name: Deploy

on:
  # Triggered when you push to `main`
  push:
    branches:
      - main

  # Triggered when you have to PR pointing to main
  pull_request:
    branches:
      - main
```

Now let's create our first job `build`:

```yml {label=my-awesome-blog/.github/workflows/deploy.yml}
name: Deploy

on:
  # Triggered when you push to `main`
  push:
    branches:
      - main

  # Triggered when you have to PR pointing to main.
  pull_request:
    branches:
      - main

jobs:
  # Job for generating .lume/_site directory and its files
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Install Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Build
        run: deno task build

      - name: Archive _site Artifact
        uses: actions/upload-artifact@master
        with:
          name: _site
          path: .lume/_site/
```

Then let's create our second job `deploy`, executed after the `build` job. This job will promote the deployment to **production** only when we push to the `main` branch:

```yml {label=my-awesome-blog/.github/workflows/deploy.yml}
name: Deploy

on:
  # Triggered when you push to `main`
  push:
    branches:
      - main

  # Triggered when you have to PR pointing to main
  pull_request:
    branches:
      - main

jobs:
  # Job for generating .lume/_site directory and its files
  build:
    # truncated...

  # Job for deploying .lume/_site
  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Install Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Download Artifact
        uses: actions/download-artifact@master
        with:
          name: _site
          path: .lume/_site/

      - name: Upload to Deno Deploy
        env:
          DENO_DEPLOY_TOKEN: ${{ secrets.DENO_DEPLOY_TOKEN }}
        run: deno task deploy ${{ endsWith(github.ref, '/main') && '--prod' || '' }}
```

Push your changes and appreciate your deployment!
