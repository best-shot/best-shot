const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { currentPath } = require('../../lib/common');

exports.name = 'basic';

const shorthand = {
  development: 'dev',
  production: 'prod'
};

exports.apply = function applyBasic({
  platform,
  mode,
  config: { publicPath, outputPath }
}) {
  return chain => {
    chain
      .target('web')
      .mode(mode)
      .context(currentPath());

    chain.optimization
      .minimize(mode === 'production')
      .set('moduleIds', mode === 'production' ? 'hashed' : 'named')
      .end();

    chain.output
      .path(currentPath(outputPath, `${platform}-${shorthand[mode]}`))
      .publicPath(publicPath)
      .filename('[name].js')
      .end();

    chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
  };
};
