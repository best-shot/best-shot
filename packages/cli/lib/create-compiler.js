const webpack = require('webpack');

module.exports = function createCompiler(config) {
  return webpack(
    Array.isArray(config) ? (config.length > 1 ? config : config[0]) : config,
  );
};
