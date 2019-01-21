declare const cherryMap: (
  options: {
    /** 匹配需要生成 sourceMap 的文件 */
    include?: string | RegExp | (RegExp | string)[];
  } = {}
) => ApplyBatch;

export = cherryMap;
