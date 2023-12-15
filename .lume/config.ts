import lume from "lume/mod.ts";
import blog from "theme/mod.ts";

import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-yaml.js";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-markdown.js";

const site = lume({
  dest: `.lume/_site`,
});
site.use(blog());
site.copy("content/assets", "assets");

site.process([".html"], (pages) => {
  pages.forEach((page) => {
    page.document!.querySelectorAll("pre code").forEach((element) => {
      const file = element.getAttribute("data-filename");
      if (file) {
        const div = page.document!.createElement("div");
        div.textContent = `# ${file}`;
        div.setAttribute(
          "style",
          [
            "opacity: 0.5",
            "font-style: italic",
            "padding-bottom: 1em",
            "font-size: 1em",
          ].join(";"),
        );
        element.prepend(div);
      }
    });
  });
});

export default site;
