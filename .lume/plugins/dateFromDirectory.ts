import { basename, dirname } from "lume/deps/path.ts";
import Site from "lume/core/site.ts";
import { parseDateFromFilename } from "lume/core/utils/date.ts";

export default function dateFromDirectory() {
  return (site: Site) => {
    site.preprocess([".md"], (pages) => {
      for (const page of pages) {
        const [, date] = parseDateFromFilename(
          basename(dirname(page.src.path)) + "_hello-world/index.md",
        );
        if (date) page.data["date"] = date;
      }
    });
  };
}
