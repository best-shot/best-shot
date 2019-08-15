declare function imageAvatar(
  options: {
    /** 头像图片目录正则 */
    include?: RegExp;
  } = {}
): (chain: any) => any;

export = imageAvatar;
