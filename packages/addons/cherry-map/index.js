// eslint-disable-next-line import/no-extraneous-dependencies
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = function cherryMap({ include = /^script\/main(.*)+/ } = {}) {
  return chain =>
    chain
      .devtool(false)
      .plugin('source-map')
      .use(SourceMapDevToolPlugin, [{ filename: '[file].map', include }]);
};
