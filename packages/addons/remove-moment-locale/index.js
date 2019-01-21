// eslint-disable-next-line import/no-extraneous-dependencies
const { IgnorePlugin } = require('webpack');

module.exports = function removeMomentLocale(config) {
  return config
    .plugin('remove-moment-locale')
    .use(IgnorePlugin, [/^\.\/locale$/, /moment$/]);
};
