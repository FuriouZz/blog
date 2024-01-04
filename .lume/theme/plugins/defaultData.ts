import { mergeData } from "lume/core/utils/merge_data.ts";
import { Data, RawData } from "lume/core/file.ts";
import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";

export interface Options {
  /**
   * Default data prefix
   * @default "_defaultdata"
   */
  prefix?: `_${string}`;
}

export const defaults: Required<Options> = {
  prefix: "_defaultdata",
};

export default function defaultData(userOptions?: Options) {
  const { prefix: folderPrefix } = merge(defaults, userOptions);
  const filePrefix = `${folderPrefix}.`;

  return (site: Site) => {
    site.addEventListener("beforeBuild", async () => {
      const dirDatas: RawData[] = [];

      site.fs.init();

      const root = site.fs.entries.get("/")!;

      for (const entry of root.children.values()) {
        if (
          (entry.type === "file" && entry.name.startsWith(filePrefix)) ||
          (entry.type === "directory" && entry.name === folderPrefix)
        ) {
          const data = await site.dataLoader.load(entry);
          dirDatas.push(data!);
        }
      }

      const dirData = mergeData(...dirDatas) as Partial<Data>;
      site.scopedData.set("/", { ...site.globalData, ...dirData });
    });
  };
}
