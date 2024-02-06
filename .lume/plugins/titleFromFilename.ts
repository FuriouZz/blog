import { basename } from "lume/deps/path.ts";
import Site from "lume/core/site.ts";

export default function titleFromFilename() {
  return (site: Site) => {
    site.preprocess([".md"], (pages) => {
      for (const page of pages) {
        const title = basename(page.src.path);
        page.data["title"] = title;
      }
    });
  };
}
