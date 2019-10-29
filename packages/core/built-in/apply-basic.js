'use strict';

const { resolve } = require('path');

exports.name = 'basic';

const shorthand = {
  development: 'dev',
  production: 'prod'
};

exports.apply = function applyBasic({
  config: { publicPath, outputPath },
  options: { watch },
  mode,
  platform = '',
  rootPath
}) {
  return chain => {
    chain
      .target('web')
      .mode(mode)
      .context(rootPath)
      .watch(watch)
      .when(watch, config =>
        config.watchOptions({
          ignore: /node_modules/
        })
      );

    chain.optimization
      .minimize(mode === 'production')
      .set('moduleIds', mode === 'production' ? 'hashed' : 'named');

    chain.output
      .publicPath(publicPath)
      .filename('[name].js')
      .path(
        resolve(
          rootPath,
          outputPath
            .replace(/\[platform\]/g, platform)
            .replace(/\[mode\]/g, mode)
            .replace(/\[mode:shorthand\]/g, shorthand[mode])
        )
      );
  };
};
