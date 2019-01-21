declare const srcAlias: (
  options: {
    /** 匹配需要应用 srcAlias 的文件 */
    include?: string | RegExp | (RegExp | string)[];
  } = {}
) => ApplyBatch;

export = srcAlias;
