declare function cherryMap(
  options: {
    /** 匹配需要生成 sourceMap 的文件 */
    include?: string | RegExp | (string | RegExp)[];
  } = {}
): (chain: any) => any;

export = cherryMap;
