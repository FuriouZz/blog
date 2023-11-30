import lume from "lume/mod.ts";
import blog from "https://deno.land/x/lume_theme_simple_blog@v0.12.2/mod.ts";
import gl from "npm:date-fns/locale/gl/index.js";

const site = lume();

site.use(blog({
  date: {
    locales: { gl },
  },
}));

export default site;
