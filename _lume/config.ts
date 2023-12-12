import lume from "lume/mod.ts";
import blog from "theme/mod.ts";
import gl from "npm:date-fns/locale/gl/index.js";

const site = lume();

site.use(blog({
  date: {
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    locales: { gl },
  },
}));

export default site;
