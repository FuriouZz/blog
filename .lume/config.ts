import lume from "lume/mod.ts";
import transform_images from "lume/plugins/transform_images.ts";
import theme from "theme/mod.ts";
import shikiji from "shikiji/mod.ts";

import override from "./plugins/override.ts";
import showLabel from "./plugins/showLabel.ts";
import emoji from "./plugins/emoji.ts";
import shikijiExtra from "shikiji/extra/mod.ts";

const site = lume({ dest: `.lume/_site` })
  .use(emoji())
  .use(theme())
  .use(override({
    rootPath: ".lume/theme",
    entries: [
      "_data.yml",
      "_data",
      "_includes",
      "assets",
      "favicons",
    ],
  }))
  .use(transform_images({ cache: ".lume/_cache" }))
  .use(showLabel())
  .use(shikiji({
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
  }))
  .use(shikijiExtra({ copyFiles: true }))
  .copy("favicons", ".")
  .copy("assets");

export default site;
