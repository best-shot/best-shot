declare function imageAvatar(
  options: {
    /** 头像图片目录 */
    avatarPath?: string;
  } = {}
): (chain: any) => any;

export = imageAvatar;
