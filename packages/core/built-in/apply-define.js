'use strict';

const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const mapValues = require('lodash/mapValues');

const { objectFilter } = require('../lib/common');

const displayName = 'define';

exports.name = displayName;

exports.apply = function applyDefine({
  config: { define },
  mode: NODE_ENV,
  platform: PLATFORM,
  options: { serve, watch }
}) {
  return chain => {
    if (define && Object.keys(define).length > 0) {
      chain
        .plugin('define')
        .use(DefinePlugin, [mapValues(define, JSON.stringify)]);
    }
    chain.plugin('environment').use(EnvironmentPlugin, [
      objectFilter({
        NODE_ENV,
        PLATFORM,
        DEBUG: serve || watch
      })
    ]);
  };
};

exports.schema = {
  define: {
    description: 'Options of DefinePlugin',
    type: 'object'
  }
};
