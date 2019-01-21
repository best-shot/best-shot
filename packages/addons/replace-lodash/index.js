// eslint-disable-next-line import/no-extraneous-dependencies
const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = function replaceLodash(config) {
  return config
    .batch(conf => conf.resolve.alias.set('lodash-es', 'lodash'))
    .plugin('replace-lodash-dot')
    .use(NormalModuleReplacementPlugin, [
      /^lodash\.\w/,
      resource => {
        // eslint-disable-next-line no-param-reassign
        resource.request = resource.request.replace('lodash.', 'lodash/');
      }
    ]);
};
