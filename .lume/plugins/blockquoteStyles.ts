import Site from "lume/core/site.ts";

export default function blockquoteStyles() {
  return (site: Site) => {
    site.process([".css"], (pages) => {
      const styles = pages.find((page) =>
        page.src.path === "/styles" && page.src.ext === ".css"
      );
      if (!styles) return;
      styles.content = styles.content ?? "";
      styles.content += `
blockquote {
  margin: 0;
  padding-block: 1em;
  padding-inline: 40px;
  background-color: var(--color-highlight);
}
      `;
    });
  };
}
