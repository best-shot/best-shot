const webpack = require('webpack');

module.exports = function createCompiler(configs) {
  return webpack(configs.length > 1 ? configs : configs[0]);
};
