const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const os = require('os');
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
  return chain =>
    chain
      .target('web')
      .mode(mode)
      .context(currentPath())
      .optimization.minimize(mode === 'production')
      .set('moduleIds', mode === 'production' ? 'hashed' : 'named')
      .end()
      .batch(config =>
        config.output
          .path(currentPath(outputPath, `${platform}-${shorthand[mode]}`))
          .publicPath(publicPath)
          .filename('[name].js')
      )
      .when(mode === 'development' && os.type() !== 'Linux', config =>
        config.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin)
      );
};
