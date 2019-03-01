const TerserPlugin = require('terser-webpack-plugin');

const displayName = 'tersor';

exports.name = displayName;

exports.apply = function applyTersor() {
  return chain => {
    const minimize = chain.optimization.get('minimize');
    return chain.when(minimize, config =>
      config.optimization.minimizer('terser').use(TerserPlugin, [
        {
          parallel: true,
          cache: false,
          sourceMap: false,
          terserOptions: {
            safari10: true,
            compress: {
              drop_console: true
            },
            output: {
              beautify: false,
              ascii_only: true
            }
          }
        }
      ])
    );
  };
};
