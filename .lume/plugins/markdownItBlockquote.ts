import Site from "lume/core/site.ts";
import container from "npm:markdown-it-container@4.0.0";

const colors: Record<string, string> = {
  warning: "yellow",
};

export default function markdownItBlockquote() {
  return (site: Site) => {
    site.hooks.addMarkdownItPlugin(container, "quote", {
      render: function (tokens: { nesting: number, info: string }[], idx: number) {
        const m = tokens[idx].info.trim().match(/^quote\s+(.*)$/);

        if (tokens[idx].nesting === 1) {
          if (m && colors[m[1]]) {
            // opening tag
            return `<blockquote style="border-left-color: ${colors[m[1]]}">`;
          }

          // opening tag
          return "<blockquote>";
        } else {
          // closing tag
          return "</blockquote>\n";
        }
      },
    });
  };
}
