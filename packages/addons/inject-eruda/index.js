const { resolve } = require('path');
const mapValues = require('lodash/mapValues');

module.exports = function injectEruda(chain) {
  const entry = mapValues(chain.entryPoints.entries(), data => data.values());
  return chain.batch(config => {
    config.entryPoints.clear().end();
    config.merge({
      entry: {
        eruda: resolve(__dirname, 'eruda'),
        ...entry
      }
    });
  });
};
