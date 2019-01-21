const CleanWebpackPlugin = require('clean-webpack-plugin');
const { relative } = require('path');
const { currentPath } = require('../../lib/common');

const displayName = 'clean-output';

exports.name = displayName;

exports.apply = function applyClean({ options: { serve, watch } }) {
  return chain =>
    chain.when(!serve && !watch, config => {
      const context = currentPath();
      return config
        .plugin(displayName)
        .use(CleanWebpackPlugin, [
          [relative(context, `${config.output.get('path')}/*`)],
          { root: context }
        ]);
    });
};
