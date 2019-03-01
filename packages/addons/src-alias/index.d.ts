declare function srcAlias(
  options: {
    /** 匹配需要应用 srcAlias 的文件 */
    include?: string | RegExp | (string | RegExp)[];
  } = {}
): (chain: any) => any;

export = srcAlias;
