import lume from "lume/mod.ts";
import theme from "theme/mod.ts";

const site = lume({ dest: `.lume/_site` }).use(theme({
  transformImages: { cache: ".lume/_cache" },
  shikiji: {
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
  },
}));

export default site;
