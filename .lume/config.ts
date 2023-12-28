import lume from "./deps/lume.ts";
import blog from "./deps/theme.ts";

import shikiji, {
  cssRulesDiff,
  cssRulesErrorLevel,
  cssRulesFocus,
  cssRulesHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "./deps/shikiji.ts";

const site = lume({ dest: `.lume/_site` });

site.use(blog()).use(
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

site.copy("content/assets", "assets");

export default site;
