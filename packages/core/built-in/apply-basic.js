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
  platform = ''
}) {
  return chain => {
    const mode = chain.get('mode');
    const context = chain.get('context');

    chain
      .target('web')
      .watch(watch)
      .when(watch, config =>
        config.watchOptions({
          ignored: /node_modules/
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
          context,
          outputPath
            .replace(/\[platform\]/g, platform)
            .replace(/\[mode\]/g, mode)
            .replace(/\[mode:shorthand\]/g, shorthand[mode])
        )
      );
  };
};
