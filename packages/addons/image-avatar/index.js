module.exports = function imageAvatar({ avatarPath = '' } = {}) {
  return chain =>
    chain.when(avatarPath, config => {
      const image = config.module.rule('image');
      return config.module
        .rule('image')
        .exclude.add(avatarPath)
        .end()
        .end()
        .rule('image-avatar')
        .test(image.get('test'))
        .include.add(avatarPath)
        .end()
        .use('file-loader')
        .loader(image.use('file-loader').get('loader'))
        .options({
          name: 'image/avatar/[name].[ext]'
        });
    });
};
