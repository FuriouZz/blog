import lume from "lume/mod.ts";
import blog from "theme/mod.ts";
import shikiji from "shikiji/mod.ts";

import {
  cssRulesDiff,
  cssRulesErrorLevel,
  cssRulesFocus,
  cssRulesHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "shikiji/transformers/mod.ts";

import picture from "lume/plugins/picture.ts";
import transformImages from "lume/plugins/transform_images.ts";

import showLabel from "./plugins/showLabel.ts";
import blockquoteStyles from "./plugins/blockquoteStyles.ts";

const site = lume({ dest: `.lume/_site` });

site
  .use(blog())
  .use(blockquoteStyles())
  .use(picture())
  .use(transformImages({ cache: ".lume/_cache" }))
  .use(showLabel())
  .use(
    shikiji({
      highlighter: {
        themes: ["github-dark", "github-light"],
        langs: ["javascript", "yaml", "markdown", "bash"],
      },
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
      useColorScheme: true,
      themeStyles: [
        cssRulesHighlight,
        cssRulesErrorLevel,
        cssRulesFocus,
        cssRulesDiff,
      ],
      transformers: [
        transformerNotationHighlight(),
        transformerNotationErrorLevel(),
        transformerNotationFocus(),
        transformerNotationDiff(),
      ],
    }),
  );


export default site;
