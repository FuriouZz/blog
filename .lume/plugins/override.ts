import { isAbsolutePath } from "lume/core/utils/path.ts";
import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";
import { join, relative } from "lume/deps/path.ts";

export interface Options {
  /**
   * Root path where files are located
   * @default Deno.cwd()
   */
  rootPath?: string;

  /**
   * Files that needs to be overrided or created if missing
   * @default []
   */
  entries: string[];
}

export const defaults: Required<Options> = {
  rootPath: ".",
  entries: [],
};

export default function override(userOptions?: Options) {
  const { rootPath: _rootPath, entries } = merge(defaults, userOptions);

  let rootPath = _rootPath;
  if (!isAbsolutePath(_rootPath)) {
    rootPath = join(Deno.cwd(), rootPath);
  }

  const append = (site: Site, path: string) => {
    site.remoteFile(
      relative(rootPath, path),
      import.meta.resolve(path),
    );
  };

  const walkDir = (site: Site, dir: string) => {
    for (const entry of Deno.readDirSync(dir)) {
      if (entry.isFile) {
        append(site, join(dir, entry.name));
        continue;
      }

      if (entry.isDirectory) {
        walkDir(site, join(dir, entry.name));
      }
    }
  };

  return (site: Site) => {
    for (const entry of entries.map((entry) => join(rootPath, entry))) {
      try {
        const info = Deno.statSync(entry);

        if (info.isFile) {
          append(site, entry);
          continue;
        }

        if (info.isDirectory) {
          walkDir(site, entry);
        }
      } catch (e) {
        console.warn("Entry does not exist: ", entry);
      }
    }
  };
}
