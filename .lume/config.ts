import lume from "lume/mod.ts";
import blog from "theme/mod.ts";

import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-yaml.js";
import "npm:prismjs@1.29.0/components/prism-json.js";


const site = lume({ dest: `.lume/_site` });

site.copy("content/assets", "assets")
site.use(blog());

export default site;
