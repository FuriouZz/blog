import date, { Options as DateOptions } from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas from "lume/plugins/metas.ts";
import pagefind, { Options as PagefindOptions } from "lume/plugins/pagefind.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import picture from "lume/plugins/picture.ts";
import transformImages, {
  Options as TransformImagesOptions,
} from "lume/plugins/transform_images.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.7.0/image.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.7.0/footnotes.ts";
import shikiji, {
  Options as ShikijiOptions,
} from "https://deno.land/x/lume_shikiji@0.0.7/mod.ts";
import shikijiExtra from "https://deno.land/x/lume_shikiji@0.0.7/extra/mod.ts";

import "lume/types.ts";
import emoji from "theme/plugins/emoji.ts";
import showLabel from "theme/plugins/showLabel.ts";

export interface Options {
  date?: Partial<DateOptions>;
  pagefind?: Partial<PagefindOptions>;
  transformImages?: Partial<TransformImagesOptions>;
  shikiji?: ShikijiOptions;
}

/** Configure the site */
export default function (options: Options = {}) {
  return (site: Lume.Site) => {
    site.use(postcss())
      .use(basePath())
      .use(toc())
      .use(readingInfo())
      .use(date(options.date))
      .use(metas())
      .use(image())
      .use(footnotes())
      .use(resolveUrls())
      .use(slugifyUrls())
      .use(terser())
      .use(pagefind(options.pagefind))
      .use(sitemap())
      .use(emoji())
      .use(showLabel())
      .use(picture())
      .use(transformImages(options.transformImages))
      .use(shikiji({
        theme: "github-light",
        ...options.shikiji,
        highlighter: {
          themes: ["github-light"],
          langs: ["javascript"],
          ...options.shikiji?.highlighter
        },
      }))
      .use(shikijiExtra({ copyFiles: true }))
      .use(feed({
        output: ["/feed.xml", "/feed.json"],
        query: "type=post",
        info: {
          title: "=metas.site",
          description: "=metas.description",
        },
        items: {
          title: "=title",
        },
      }))
      .copy("fonts")
      .copy("js")
      .copy("favicon.png")
      .preprocess([".md"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /<!--\s*more\s*-->/i,
          )[0];
        }
      });

    // Basic CSS Design System
    site.remoteFile(
      "_includes/css/ds.css",
      "https://unpkg.com/@lumeland/ds@0.4.0/ds.css",
    );

    // Mastodon comment system
    site.remoteFile(
      "/js/comments.js",
      "https://unpkg.com/@oom/mastodon-comments@0.2.1/src/comments.js",
    );
  };
}
