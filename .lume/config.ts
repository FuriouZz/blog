import lume from "lume/mod.ts";
import blog from "theme/mod.ts";
import shikiji from "shikiji/mod.ts";
import shikijiExtra from "shikiji/extra/mod.ts";

import picture from "lume/plugins/picture.ts";
import transformImages from "lume/plugins/transform_images.ts";

import emoji from "./plugins/emoji.ts";
import showLabel from "./plugins/showLabel.ts";
import blockquoteStyles from "./plugins/blockquoteStyles.ts";

const site = lume({ dest: `.lume/_site` });

site
  .use(blog())
  .use(emoji())
  .use(blockquoteStyles())
  .use(picture())
  .use(transformImages({ cache: ".lume/_cache" }))
  .use(showLabel())
  .use(
    shikiji({
      highlighter: {
        themes: ["github-dark", "github-light"],
        langs: ["javascript", "yaml", "markdown", "bash", "json", "typescript"],
      },
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
      cssFile: "/styles/shikiji.css",
      useColorScheme: true,
    }),
  )
  .use(shikijiExtra({ copyFiles: true }));

export default site;
