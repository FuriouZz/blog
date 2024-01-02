import Site from "lume/core/site.ts";

import { full } from "npm:markdown-it-emoji@3.0.0";

export default function emoji() {
  return (site: Site) => {
    site.hooks.addMarkdownItPlugin(full, { defs: { "dino": "🦕" } });
    // deno-lint-ignore no-explicit-any
    site.hooks.addMarkdownItRule("emoji", (token: any[], idx: number) => {
      return `<span class="emoji emoji_${token[idx].markup}">${
        token[idx].content
      }</span>`;
    });

    site.process([".html"], (pages) => {
      pages.forEach((page) => {
        const style = page.document?.createElement("style");
        if (!style) return;
        style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
span.emoji {
  font-family: "Noto Color Emoji", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-style: normal;
}`;
        page.document?.head.append(style);
      });
    });
  };
}
