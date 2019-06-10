'use strict';

const { resolve } = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

exports.name = 'basic';

const shorthand = {
  development: 'dev',
  production: 'prod'
};

exports.apply = function applyBasic({
  config: { publicPath, outputPath },
  mode,
  platform = '',
  rootPath
}) {
  return chain => {
    chain
      .target('web')
      .mode(mode)
      .context(rootPath);

    chain.optimization
      .minimize(mode === 'production')
      .set('moduleIds', mode === 'production' ? 'hashed' : 'named');

    chain.output
      .path(
        resolve(
          rootPath,
          outputPath
            .replace(/\[platform\]/g, platform)
            .replace(/\[mode\]/g, mode)
            .replace(/\[mode:shorthand\]/g, shorthand[mode])
        )
      )
      .publicPath(publicPath)
      .filename('[name].js');

    chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
  };
};
